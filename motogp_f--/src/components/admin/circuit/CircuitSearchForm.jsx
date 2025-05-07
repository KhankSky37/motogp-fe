import React from "react";
import { Button, Form, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { COUNTRIES } from "../../../constants/Countries.jsx";

const { Option } = Select;

const CircuitSearchForm = ({ onFinish }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="inline" onFinish={onFinish} className="mb-4">
      <Form.Item name="keyword">
        <Input
          placeholder="Search by Name, City or Country"
          allowClear
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
      </Form.Item>

      <Form.Item name="country">
        <Select placeholder="Select Country" allowClear style={{ width: 180 }}>
          {COUNTRIES.map((country) => (
            <Option key={country.code} value={country.code}>
              {country.name}
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

export default CircuitSearchForm;
