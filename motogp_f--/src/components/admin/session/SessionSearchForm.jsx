import { Button, Card, DatePicker, Form, Input, Select } from "antd";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";

const { Option } = Select;

const SessionSearchForm = ({
  onSearch,
  events = [],
  categories = [],
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onSearch({});
  };

  const handleSearch = (values) => {
    onSearch(values);
  };

  return (
    <Card title="Search Sessions" className="mb-4">
      <Form form={form} layout="vertical" onFinish={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item name="eventId" label="Event">
            <Select allowClear placeholder="Select event" loading={loading}>
              {events.map((event) => (
                <Option key={event.id} value={event.id}>
                  {event.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="categoryId" label="Category">
            <Select allowClear placeholder="Select category" loading={loading}>
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="sessionType" label="Session Type">
            <Select allowClear placeholder="Select session type">
              <Option value="PRACTICE">Practice</Option>
              <Option value="QUALIFYING">Qualifying</Option>
              <Option value="RACE">Race</Option>
              <Option value="SPRINT">Sprint</Option>
              <Option value="WARM_UP">Warm Up</Option>
            </Select>
          </Form.Item>

          <Form.Item name="dateFrom" label="From Date">
            <DatePicker className="w-full" showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>

          <Form.Item name="dateTo" label="To Date">
            <DatePicker className="w-full" showTime format="YYYY-MM-DD HH:mm" />
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
