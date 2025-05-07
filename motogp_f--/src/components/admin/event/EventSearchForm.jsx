import React, { useState } from "react";
import { Button, Form, Input, DatePicker, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;

const EventSearchForm = ({
  onSearch,
  seasons = [],
  circuits = [],
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [expandForm, setExpandForm] = useState(false);

  const handleFinish = (values) => {
    const formattedValues = { ...values };

    // Format date range if present
    if (values.dateRange) {
      formattedValues.startDateFrom = values.dateRange[0]?.format("YYYY-MM-DD");
      formattedValues.startDateTo = values.dateRange[1]?.format("YYYY-MM-DD");
      delete formattedValues.dateRange;
    }

    onSearch(formattedValues);
  };

  const toggleForm = () => {
    setExpandForm(!expandForm);
  };

  const resetForm = () => {
    form.resetFields();
    onSearch({});
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="mb-4 bg-white p-4 rounded shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Form.Item name="keyword" >
          <Input
            placeholder="Search by name or official name"
            allowClear
            prefix={<SearchOutlined />}
          />
        </Form.Item>

        {expandForm && (
          <>
            <Form.Item name="seasonId" >
              <Select
                placeholder="Select season"
                allowClear
                loading={loading}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {seasons.map((season) => (
                  <Option key={season.id} value={season.id}>
                    {season.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="circuitId" >
              <Select
                placeholder="Select circuit"
                allowClear
                loading={loading}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {circuits.map((circuit) => (
                  <Option key={circuit.id} value={circuit.id}>
                    {circuit.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="eventType">
              <Select allowClear placeholder="Select event type">
                <Option value="RACE">Race</Option>
                <Option value="TEST">Test</Option>
              </Select>
            </Form.Item>

            <Form.Item name="dateRange" >
              <RangePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
          </>
        )}
      </div>

      <div className="flex justify-between mt-2">
        <Button type="link" onClick={toggleForm}>
          {expandForm ? "Simple Search" : "Advanced Search"}
        </Button>
        <div>
          <Button onClick={resetForm} className="mr-2">
            Reset
          </Button>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Search
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default EventSearchForm;
