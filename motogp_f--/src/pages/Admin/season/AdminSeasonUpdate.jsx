import React, {useCallback, useEffect, useState} from 'react';
import {Button, Card, Form, Input, InputNumber, message, Spin} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import {useNavigate, useParams} from 'react-router-dom';
import SeasonService from '../../../services/SeasonService.jsx';

const AdminSeasonUpdate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {seasonId} = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  
  // Fetch season data on component mount
  useEffect(() => {
    const fetchSeasonData = async () => {
      if (!seasonId) return;
      setInitialLoading(true);
      try {
        const response = await SeasonService.getSeasonById(seasonId);
        const seasonData = response.data;
        form.setFieldsValue(seasonData);
      } catch (error) {
        console.error('Failed to fetch season data:', error);
        messageApi.error('Failed to load season data. Please try again.');
        navigate('/admin/seasons');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchSeasonData();
  }, [seasonId, form, messageApi, navigate]);

  const onFinish = useCallback(async (values) => {
    setLoading(true);

    const seasonDto = {
      id: values.id,
      name: values.name,
    };

    try {
      await SeasonService.updateSeason(seasonId, seasonDto);
      messageApi.success('Season updated successfully!');
      navigate('/admin/seasons');
    } catch (error) {
      console.error('Failed to update season:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update season. Please try again.';
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [seasonId, messageApi, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/admin/seasons');
  }, [navigate]);

  if (initialLoading) {
    return <Spin spinning={true} tip="Loading season data..." className="flex justify-center items-center h-64"/>;
  }

  return (
    <Spin spinning={loading}>
      {contextHolder}
      <Card title={
        <div className="flex items-center">
          <Button type="text" icon={<ArrowLeftOutlined/>} onClick={handleCancel} className="mr-2" aria-label="Back"/>
          Update Season (ID: {seasonId})
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
            rules={[{required: true, message: 'Please input the season name!'}]}
          >
            <Input placeholder="Enter season name (e.g., Season 2025)" />
          </Form.Item>

          <Form.Item wrapperCol={{offset: 6, span: 18}} className={"border-t pt-4 mt-4"}>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
              <Button onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Season
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminSeasonUpdate;