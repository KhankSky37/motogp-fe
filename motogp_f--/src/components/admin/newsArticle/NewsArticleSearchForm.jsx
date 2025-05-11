import React from 'react';
import {Button, Col, Form, Input, Row, Space} from 'antd';
import {SearchOutlined} from "@ant-design/icons";

const NewsArticleSearchForm = ({onSearch}) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    // values sẽ là { keyword: "..." }
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
        <Col xs={24} sm={12} md={10} lg={8}>
          <Form.Item
            name="keyword" // Một trường keyword duy nhất
          >
            <Input
              placeholder="Enter title or article type"
              prefix={<SearchOutlined/>}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={14} lg={16} className="flex items-end">
          <Form.Item className="w-full md:w-auto"> {/* Điều chỉnh width cho responsive */}
            <Space>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button onClick={handleReset}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default NewsArticleSearchForm;