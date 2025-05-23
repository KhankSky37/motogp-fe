import React, { useCallback, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, message, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SeasonService from '../../../services/SeasonService.jsx';

const AdminSeasonCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = useCallback(async (values) => {
    setLoading(true);

    const seasonDto = {
      id: values.id,
      name: values.name,
    };

    try {
      await SeasonService.createSeason(seasonDto);
      messageApi.success('Season created successfully!', 0.5, () => {
        form.resetFields();
        navigate('/admin/seasons');
      });
    } catch (error) {
      console.error('Failed to create season:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create season. Please try again.';
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [form, messageApi, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/admin/seasons');
  }, [navigate]);

  return (
    <Spin spinning={loading}>
      {contextHolder}
      <Card title={
        <div className="flex items-center">
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleCancel} className="mr-2" aria-label="Back" />
          Create New Season
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
            name="id"
            label="Season ID"
            rules={[
              { required: true, message: 'Please input the Season ID!' },
              { type: 'number', message: 'Season ID must be a number!' }
            ]}
          >
            <InputNumber placeholder="Enter Season ID (e.g., 2025)" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="name"
            label="Season Name"
            rules={[{ required: true, message: 'Please input the season name!' }]}
          >
            <Input placeholder="Enter season name (e.g., Season 2025)" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 18 }} className={"border-t pt-4 mt-4"}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Season
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminSeasonCreate;