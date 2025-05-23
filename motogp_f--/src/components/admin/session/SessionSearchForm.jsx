import { Button, Card, DatePicker, Form, Select } from "antd";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import React from "react";

const { Option } = Select;

const SessionSearchForm = ({
  onSearch,
  categories = [],
  events = [],
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onSearch({});
  };
  const handleSearch = (values) => {
    // Ensure we're sending proper values even if fields are empty
    const formattedValues = {
      eventId: values.eventId || undefined,
      categoryId: values.categoryId || undefined,
      sessionType: values.sessionType || undefined,
      dateFrom: values.dateFrom
        ? values.dateFrom.format("YYYY-MM-DD HH:mm")
        : undefined,
      dateTo: values.dateTo
        ? values.dateTo.format("YYYY-MM-DD HH:mm")
        : undefined,
    };

    onSearch(formattedValues);
  };

  return (
    <Card title="Search Sessions" className="mb-4">
      <Form form={form} layout="vertical" onFinish={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item name="eventId">
            <Select allowClear placeholder="Select event" loading={loading}>
              {events.map((event) => (
                <Option key={event.id} value={event.id}>
                  {event.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="categoryId">
            <Select allowClear placeholder="Select category" loading={loading}>
              {categories.map((category) => (
                <Option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>{" "}
          <Form.Item name="sessionType">
            <Select placeholder="Select session type">
              <Option value="FP1">Free Practice Nr. 1</Option>
              <Option value="FP2">Free Practice Nr. 2</Option>
              <Option value="P1">Practice Nr. 1</Option>
              <Option value="P2">Practice Nr. 2</Option>
              <Option value="Q1">Qualifying Nr. 1</Option>
              <Option value="Q2">Qualifying Nr. 2</Option>
              <Option value="RAC1">Race Nr.1</Option>
              <Option value="RAC2">Race Nr.2</Option>
              <Option value="PR">Practice</Option>
              <Option value="WUP">Warm Up</Option>
              <Option value="RAC">Race</Option>
              <Option value="SPR">Tissot Sprint </Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateFrom">
            <DatePicker
              className="w-full"
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder="From date"
            />
          </Form.Item>
          <Form.Item name="dateTo">
            <DatePicker
              className="w-full"
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder="To date"
            />
          </Form.Item>
        </div>

        <div className="flex justify-end">
          <Button
            icon={<UndoOutlined />}
            onClick={handleReset}
            className="mr-2"
          >
            Reset
          </Button>
          <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
            Search
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default SessionSearchForm;
