import React, {useCallback, useEffect, useState} from 'react';
import {Button, Card, DatePicker, Form, Input, message, Select, Spin} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import {useNavigate, useParams} from 'react-router-dom';
import RiderService from '../../../services/RiderService.jsx';
import {COUNTRIES} from '../../../constants/Countries.jsx';
import ImageUploadField from '../../../components/admin/shared/ImageUploadField.jsx';
import dayjs from 'dayjs'; // Import dayjs để xử lý date object

const {Option} = Select;

const AdminRiderUpdate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {riderId} = useParams(); // Lấy riderId từ URL (đã đổi tên trong route)
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch rider data on component mount
  useEffect(() => {
    const fetchRiderData = async () => {
      if (!riderId) return;
      setInitialLoading(true);
      try {
        const response = await RiderService.getRiderById(riderId);
        const riderData = response.data;

        const formattedData = {
          ...riderData,
          dateOfBirth: riderData.dateOfBirth ? dayjs(riderData.dateOfBirth, 'YYYY-MM-DD') : null,
          // Set initial value for the photo field using the URL
          // ImageUploadField will handle displaying this URL
          photo: riderData.photoUrl || null,
        };

        form.setFieldsValue(formattedData);
        // No need for separate initialPhotoUrl state if form field is set correctly
        // setInitialPhotoUrl(riderData.photoUrl);

      } catch (error) {
        console.error('Failed to fetch rider data:', error);
        messageApi.error('Failed to load rider data. Please try again.');
        navigate('/admin/riders');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchRiderData();
  }, [riderId, form, messageApi, navigate]);

  const onFinish = useCallback(async (values) => {
    setLoading(true);

    // Check if values.photo is a new File object or the initial URL string/null
    const newPhotoFile = values.photo instanceof File ? values.photo : null;

    // Construct the DTO
    const riderDto = {
      // riderId is not needed in the DTO body for update
      firstName: values.firstName,
      lastName: values.lastName,
      nationality: values.nationality,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
      // photoUrl is handled by the backend based on whether a new file is sent
    };

    try {
      // Call the updated service function, passing the new file (or null)
      await RiderService.updateRider(riderId, riderDto, newPhotoFile);
      messageApi.success('Rider updated successfully!', 0.5, () => {
        navigate('/admin/riders');
      });
    } catch (error) {
      console.error('Failed to update rider:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update rider. Please try again.';
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [riderId, messageApi, navigate]); // Removed form from dependencies

  const handleCancel = useCallback(() => {
    navigate('/admin/riders');
  }, [navigate]);

  if (initialLoading) {
    return <Spin spinning={true} tip="Loading rider data..." className="flex justify-center items-center h-64"/>;
  }

  return (
    <Spin spinning={loading}>
      {contextHolder}
      <Card title={
        <div className="flex items-center">
          <Button type="text" icon={<ArrowLeftOutlined/>} onClick={handleCancel} className="mr-2" aria-label="Back"/>
          Update Rider (ID: {riderId})
        </div>
      }>
        <Form
          form={form}
          layout="horizontal"
          labelAlign="left"
          requiredMark="optional"
          labelCol={{span: 6}}
          wrapperCol={{span: 18}}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="photo"
            label="Photo"
            // Validation rule might not be 'required' for update
            // rules={[{ required: true, message: 'Please upload a rider photo!' }]}
          >
            {/* ImageUploadField now receives the initial URL via form.setFieldsValue */}
            <ImageUploadField/>
          </Form.Item>

          <Form.Item
            name="riderId"
            label="Rider ID"
            rules={[{required: true, message: 'Please input the Rider ID!'}]}
          >
            <Input placeholder="Enter Rider ID (e.g., VR46)" disabled/>
          </Form.Item>

          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{required: true, message: 'Please input the first name!'}]}
          >
            <Input placeholder="Enter first name"/>
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{required: true, message: 'Please input the last name!'}]}
          >
            <Input placeholder="Enter last name"/>
          </Form.Item>

          <Form.Item
            name="nationality"
            label="Nationality"
            rules={[{required: true, message: 'Please select the nationality!'}]}
          >
            <Select placeholder="Select nationality" allowClear>
              {COUNTRIES.map(country => (
                <Option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
            rules={[{required: true, message: 'Please select the date of birth!'}]}
          >
            <DatePicker style={{width: '100%'}} format="YYYY-MM-DD"/>
          </Form.Item>

          <Form.Item wrapperCol={{offset: 6, span: 18}} className={"border-t pt-4 mt-4"}>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
              <Button onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Rider
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminRiderUpdate;