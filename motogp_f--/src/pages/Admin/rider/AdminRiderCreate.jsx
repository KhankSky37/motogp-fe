import React, { useCallback, useState } from 'react';
import { Button, Card, DatePicker, Form, Input, message, Select, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RiderService from '../../../services/RiderService.jsx';
import { COUNTRIES } from '../../../constants/Countries.jsx';
import ImageUploadField from '../../../components/admin/shared/ImageUploadField.jsx';

const { Option } = Select;

const AdminRiderCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = useCallback(async (values) => {
    const photoFile = values.photo;

    setLoading(true);

    const riderDto = {
      riderId: values.riderId,
      firstName: values.firstName,
      lastName: values.lastName,
      nationality: values.nationality,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
    };

    try {
      await RiderService.createRider(riderDto, photoFile);
      messageApi.success('Rider created successfully!');
      form.resetFields();
      navigate('/admin/riders');
    } catch (error) {
      console.error('Failed to create rider:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create rider. Please try again.';
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [form, messageApi, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/admin/riders');
  }, [navigate]);

  return (
    <Spin spinning={loading}>
      {contextHolder}
      <Card title={
        <div className="flex items-center">
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleCancel} className="mr-2" aria-label="Back" />
          Create New Rider
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
        >
          <Form.Item
            name="photo"
            label="Photo"
            rules={[{ required: true, message: 'Please upload a rider photo!' }]}
          >
            <ImageUploadField />
          </Form.Item>

          <Form.Item
            name="riderId"
            label="Rider ID"
            rules={[{ required: true, message: 'Please input the Rider ID!' }]}
          >
            <Input placeholder="Enter Rider ID (e.g., VR46)" />
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
                Create Rider
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminRiderCreate;