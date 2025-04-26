import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, DatePicker, Form, Input, message, Select, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import RiderService from '../../../services/RiderService.jsx';
import { COUNTRIES } from '../../../constants/Countries.jsx';
import ImageUploadField from '../../../components/admin/shared/ImageUploadField.jsx';
import dayjs from 'dayjs'; // Import dayjs để xử lý date object

const { Option } = Select;

const AdminRiderUpdate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { riderId: riderId } = useParams(); // Lấy riderId từ URL
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // State cho lần load dữ liệu đầu tiên
  const [messageApi, contextHolder] = message.useMessage();
  const [initialPhotoUrl, setInitialPhotoUrl] = useState(null); // Lưu URL ảnh ban đầu (nếu có)

  // Fetch rider data on component mount
  useEffect(() => {
    const fetchRiderData = async () => {
      if (!riderId) return;
      setInitialLoading(true);
      try {
        const response = await RiderService.getRiderById(riderId);
        const riderData = response.data;

        // Chuyển đổi date string sang dayjs object cho DatePicker
        const formattedData = {
          ...riderData,
          dateOfBirth: riderData.dateOfBirth ? dayjs(riderData.dateOfBirth, 'YYYY-MM-DD') : null,
          // Không cần set 'photo' ở đây vì ImageUploadField xử lý value riêng
        };

        form.setFieldsValue(formattedData);
        // Lưu URL ảnh ban đầu để truyền vào ImageUploadField
        // Giả sử photoUrl trả về từ API là đường dẫn tương đối
        // Cần hàm getImageUrl để tạo URL đầy đủ nếu cần
        // setInitialPhotoUrl(getImageUrl(riderData.photoUrl)); // Nếu cần URL đầy đủ
        setInitialPhotoUrl(riderData.photoUrl); // Hoặc chỉ cần đường dẫn nếu ImageUploadField xử lý được

      } catch (error) {
        console.error('Failed to fetch rider data:', error);
        messageApi.error('Failed to load rider data. Please try again.');
        navigate('/admin/riders'); // Điều hướng về nếu lỗi
      } finally {
        setInitialLoading(false);
      }
    };

    fetchRiderData();
  }, [riderId, form, messageApi, navigate]);

  const onFinish = useCallback(async (values) => {
    setLoading(true);

    // Lấy file mới từ ImageUploadField nếu có thay đổi
    const newPhotoFile = values.photo instanceof File ? values.photo : null;

    // **QUAN TRỌNG:** Logic cập nhật ảnh cần xem xét:
    // 1. Backend `updateRider` hiện tại chỉ nhận JSON (@RequestBody).
    // 2. `RiderService.updateRider` hiện tại chỉ gửi JSON.
    // => Phiên bản này CHƯA hỗ trợ cập nhật file ảnh. Chỉ cập nhật các trường thông tin khác.
    // Nếu muốn cập nhật ảnh, cần sửa backend và service để xử lý multipart/form-data.

    if (newPhotoFile) {
      messageApi.warning('Photo update is not supported in this version. Only other fields will be updated.');
      // Hoặc nếu backend ĐÃ hỗ trợ multipart:
      // const formData = new FormData();
      // formData.append('rider', new Blob([JSON.stringify(riderDto)], { type: 'application/json' }));
      // formData.append('photo', newPhotoFile);
      // await RiderService.updateRiderMultipart(riderId, formData); // Cần tạo hàm mới trong service
    }

    const riderDto = {
      // Không gửi riderId trong DTO khi update (thường ID nằm trong URL)
      firstName: values.firstName,
      lastName: values.lastName,
      nationality: values.nationality,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
      // Không gửi photoUrl ở đây, backend sẽ xử lý việc giữ lại hoặc cập nhật nếu có file mới
    };


    try {
      // Gọi hàm update hiện tại (chỉ gửi JSON)
      await RiderService.updateRider(riderId, riderDto);
      messageApi.success('Rider updated successfully!');
      navigate('/admin/riders');
    } catch (error) {
      console.error('Failed to update rider:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update rider. Please try again.';
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [riderId, messageApi, navigate]); // Bỏ form khỏi dependency vì nó ổn định

  const handleCancel = useCallback(() => {
    navigate('/admin/riders');
  }, [navigate]);

  if (initialLoading) {
    return <Spin spinning={true} tip="Loading rider data..." className="flex justify-center items-center h-64" />;
  }

  return (
    <Spin spinning={loading}>
      {contextHolder}
      <Card title={
        <div className="flex items-center">
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleCancel} className="mr-2" aria-label="Back" />
          Update Rider (ID: {riderId})
        </div>
      }>
        <Form
          form={form}
          layout="horizontal"
          labelAlign="left"
          requiredMark="optional"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
          autoComplete="off"
          // initialValues được set bằng form.setFieldsValue trong useEffect
        >
          <Form.Item
            name="photo"
            label="Photo"
            // Rules có thể không cần required nếu cho phép không đổi ảnh
            // rules={[{ required: true, message: 'Please upload a rider photo!' }]}
          >
            {/* Truyền initialPhotoUrl vào ImageUploadField */}
            {/* ImageUploadField cần được cập nhật để nhận và hiển thị value ban đầu */}
            <ImageUploadField value={initialPhotoUrl} />
          </Form.Item>

          <Form.Item
            name="riderId"
            label="Rider ID"
            rules={[{ required: true, message: 'Please input the Rider ID!' }]}
          >
            {/* Có thể disable trường ID nếu không cho phép sửa */}
            <Input placeholder="Enter Rider ID (e.g., VR46)" disabled />
          </Form.Item>

          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please input the first name!' }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please input the last name!' }]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>

          <Form.Item
            name="nationality"
            label="Nationality"
            rules={[{ required: true, message: 'Please select the nationality!' }]}
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
            rules={[{ required: true, message: 'Please select the date of birth!' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 18 }} className={"border-t pt-4 mt-4"}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
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