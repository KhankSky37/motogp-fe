import React from 'react';
import {Form, Input, Button, Row, Col, Select, Space} from 'antd';
import {SearchOutlined} from "@ant-design/icons";

const {Option} = Select;

const UserSearchForm = ({onSearch, loading}) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onSearch({}); // Gọi onSearch với object rỗng để reset
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="keyword">
            <Input placeholder="Search Name, Email, Nickname" prefix={<SearchOutlined/>}
                   allowClear/>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="role">
            <Select placeholder="Select role" allowClear>
              <Option value="ADMIN">ADMIN</Option>
              <Option value="USER">USER</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6} className="flex items-end">
          <Form.Item className="w-full">
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Search
              </Button>
              <Button onClick={handleReset} loading={loading}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default UserSearchForm;