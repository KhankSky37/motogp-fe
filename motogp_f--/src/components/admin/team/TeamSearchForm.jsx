import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, Select } from "antd";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import ManufacturerService from "../../../services/ManufacturerService.jsx";

const { Option } = Select;

const TeamSearchForm = ({ onFinish }) => {
  const [form] = Form.useForm();
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchManufacturers = async () => {
      setLoading(true);
      try {
        const response = await ManufacturerService.getAllManufacturers();
        setManufacturers(response.data || []);
      } catch (error) {
        console.error("Failed to fetch manufacturers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManufacturers();
  }, []);

  const handleReset = () => {
    form.resetFields();
    onFinish({});
  };

  const handleSearch = (values) => {
    onFinish(values);
  };

  return (
    <Card title="Search Teams" className="mb-4">
      <Form form={form} layout="vertical" onFinish={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item name="keyword">
            <Input
              placeholder="Search by Name"
              allowClear
              prefix={<SearchOutlined />}
            />
          </Form.Item>

          <Form.Item name="manufacturerId">
            <Select
              allowClear
              placeholder="Select manufacturer"
              showSearch
              optionFilterProp="children"
              loading={loading}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {manufacturers.map((manufacturer) => (
                <Option key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="flex justify-end">
            <div className="flex gap-2">
              <Button icon={<UndoOutlined />} onClick={handleReset}>
                Reset
              </Button>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                htmlType="submit"
              >
                Search
              </Button>
            </div>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
};

export default TeamSearchForm;
