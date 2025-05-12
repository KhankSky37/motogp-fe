import React from 'react';
import { Form, Select, Button, Row, Col, Space } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';

const { Option } = Select;

const ContractSearchForm = ({
                              onSearch,
                              loading,
                              teamsData = [],
                              ridersData = [],
                              seasonsData = [],
                              categoriesData = [],
                            }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    // Lọc ra các giá trị undefined hoặc rỗng để không gửi lên backend
    const cleanedValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    onSearch(cleanedValues);
  };

  const handleReset = () => {
    form.resetFields();
    onSearch({}); // Gọi onSearch với object rỗng để reset
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} className={'mb-4'}>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="teamId">
            <Select placeholder="Select team" allowClear showSearch filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
              {teamsData.map(team => <Option key={team.id} value={team.id} label={`${team.name} (${team.id})`}>{team.name} ({team.id})</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="riderId">
            <Select placeholder="Select rider" allowClear showSearch filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
              {ridersData.map(rider => <Option key={rider.riderId} value={rider.riderId} label={`${rider.firstName} ${rider.lastName} (${rider.riderId})`}>{rider.firstName} {rider.lastName} ({rider.riderId})</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="seasonId">
            <Select placeholder="Select season" allowClear showSearch filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
              {seasonsData.map(season => <Option key={season.id} value={season.id} label={`${season.name} (${season.id})`}>{season.name} ({season.id})</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="categoryId">
            <Select placeholder="Select category" allowClear showSearch filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
              {categoriesData.map(category => <Option key={category.categoryId} value={category.categoryId} label={`${category.name} (${category.categoryId})`}>{category.name} ({category.categoryId})</Option>)}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Space>
            <Button icon={<ClearOutlined />} onClick={handleReset} disabled={loading}>
              Reset
            </Button>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
              Search
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};

export default ContractSearchForm;