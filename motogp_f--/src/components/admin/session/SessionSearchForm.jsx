import { Button, Card, DatePicker, Form, Select } from "antd";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";

const { Option } = Select;

const SessionSearchForm = ({ onSearch, categories = [], loading = false }) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onSearch({});
  };

  const handleSearch = (values) => {
    // Ensure we're sending proper values even if fields are empty
    const formattedValues = {
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
          <Form.Item name="categoryId">
            <Select allowClear placeholder="Select category" loading={loading}>
              {categories.map((category) => (
                <Option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="sessionType">
            <Select allowClear placeholder="Select session type">
              <Option value="PRACTICE">Practice</Option>
              <Option value="QUALIFYING">Qualifying</Option>
              <Option value="RACE">Race</Option>
              <Option value="SPRINT">Sprint</Option>
              <Option value="WARM_UP">Warm Up</Option>
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
