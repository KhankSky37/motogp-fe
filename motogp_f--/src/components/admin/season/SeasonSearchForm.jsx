import React from 'react';
import {Button, Form, Input} from 'antd';
import {SearchOutlined} from '@ant-design/icons';

const SeasonSearchForm = ({onFinish}) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onFinish}
      className="mb-4"
    >
      <Form.Item name="keyword">
        <Input
          placeholder="Search by ID or Name"
          allowClear
          prefix={<SearchOutlined/>}
          style={{width: 300}}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>
          Search
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SeasonSearchForm;