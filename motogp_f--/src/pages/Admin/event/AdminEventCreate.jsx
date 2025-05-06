import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Spin,
  message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import EventService from "../../../services/EventService.jsx";
import SeasonService from "../../../services/SeasonService.jsx";
import CircuitService from "../../../services/CircuitService.jsx";

const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminEventCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [seasonsLoading, setSeasonsLoading] = useState(false);
  const [circuitsLoading, setCircuitsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch seasons and circuits for dropdown menus
  useEffect(() => {
    const fetchData = async () => {
      try {
        setSeasonsLoading(true);
        setCircuitsLoading(true);

        const [seasonsResponse, circuitsResponse] = await Promise.all([
          SeasonService.getAllSeasons(),
          CircuitService.getAllCircuits(),
        ]);

        setSeasons(seasonsResponse.data);
        setCircuits(circuitsResponse.data);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        messageApi.error("Failed to load data. Please refresh and try again.");
      } finally {
        setSeasonsLoading(false);
        setCircuitsLoading(false);
      }
    };

    fetchData();
  }, [messageApi]);

  const onFinish = useCallback(
    async (values) => {
      setLoading(true);

      try {
        // Format the date values
        const formattedValues = {
          ...values,
          season: { id: values.seasonId },
          circuit: { id: values.circuitId },
        };

        // Remove separate IDs as they're now in nested objects
        delete formattedValues.seasonId;
        delete formattedValues.circuitId;

        await EventService.createEvent(formattedValues);
        messageApi.success("Event created successfully!");
        form.resetFields();
        navigate("/admin/events");
      } catch (error) {
        console.error("Failed to create event:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to create event. Please try again.";
        messageApi.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [form, messageApi, navigate]
  );

  const handleCancel = useCallback(() => {
    navigate("/admin/events");
  }, [navigate]);

  return (
    <Spin spinning={loading}>
      {contextHolder}
      <Card
        title={
          <div className="flex items-center">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleCancel}
              className="mr-2"
              aria-label="Back"
            />
            Create New Event
          </div>
        }
      >
        <Form
          form={form}
          layout="horizontal"
          labelAlign="left"
          requiredMark="optional"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Event Name"
            rules={[
              { required: true, message: "Please input the event name!" },
            ]}
          >
            <Input placeholder="Enter event name" />
          </Form.Item>

          <Form.Item
            name="officialName"
            label="Official Name"
            rules={[
              { required: true, message: "Please input the official name!" },
            ]}
          >
            <Input placeholder="Enter official name" />
          </Form.Item>

          <Form.Item
            name="seasonId"
            label="Season"
            rules={[{ required: true, message: "Please select a season!" }]}
          >
            <Select placeholder="Select season" loading={seasonsLoading}>
              {seasons.map((season) => (
                <Option key={season.id} value={season.id}>
                  {season.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="circuitId"
            label="Circuit"
            rules={[{ required: true, message: "Please select a circuit!" }]}
          >
            <Select placeholder="Select circuit" loading={circuitsLoading}>
              {circuits.map((circuit) => (
                <Option key={circuit.id} value={circuit.id}>
                  {circuit.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="eventType"
            label="Event Type"
            rules={[
              { required: true, message: "Please select an event type!" },
            ]}
          >
            <Select placeholder="Select event type">
              <Option value="RACE">Race</Option>
              <Option value="TEST">Test</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please select a start date!" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="Select start date"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select an end date!" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="Select end date"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{ offset: 6, span: 18 }}
            className="border-t pt-4 mt-4"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Button onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Event
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminEventCreate;
