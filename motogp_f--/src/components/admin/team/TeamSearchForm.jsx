import React from "react";
import { Button, Form, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const TeamSearchForm = ({ manufacturers, onFinish }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="inline" onFinish={onFinish} className="mb-4">
      <Form.Item name="keyword">
        <Input
          placeholder="Search Name or ID"
          allowClear
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
      </Form.Item>
      <Form.Item name="manufacturerId">
        <Select
          placeholder="Select Manufacturer"
          allowClear
          style={{ width: 180 }}
        >
          {manufacturers?.map((manufacturer) => (
            <Option key={manufacturer.id} value={manufacturer.id}>
              {manufacturer.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
          Search
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TeamSearchForm;
