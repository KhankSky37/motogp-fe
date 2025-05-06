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
import { useNavigate, useParams } from "react-router-dom";
import EventService from "../../../services/EventService.jsx";
import SeasonService from "../../../services/SeasonService.jsx";
import CircuitService from "../../../services/CircuitService.jsx";
import dayjs from "dayjs";

const { Option } = Select;

const AdminEventUpdate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [seasons, setSeasons] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [seasonsLoading, setSeasonsLoading] = useState(false);
  const [circuitsLoading, setCircuitsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch event data and options for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        setSeasonsLoading(true);
        setCircuitsLoading(true);

        // Fetch event data and dropdown options in parallel
        const [eventResponse, seasonsResponse, circuitsResponse] =
          await Promise.all([
            EventService.getEventById(eventId),
            SeasonService.getAllSeasons(),
            CircuitService.getAllCircuits(),
          ]);

        // Set dropdown options
        setSeasons(seasonsResponse.data);
        setCircuits(circuitsResponse.data);

        // Set form values from event data
        const eventData = eventResponse.data;
        form.setFieldsValue({
          name: eventData.name,
          officialName: eventData.officialName,
          seasonId: eventData.season?.id,
          circuitId: eventData.circuit?.id,
          eventType: eventData.eventType,
          startDate: eventData.startDate ? dayjs(eventData.startDate) : null,
          endDate: eventData.endDate ? dayjs(eventData.endDate) : null,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        messageApi.error("Failed to load data. Please refresh and try again.");
        navigate("/admin/events");
      } finally {
        setFetchLoading(false);
        setSeasonsLoading(false);
        setCircuitsLoading(false);
      }
    };

    fetchData();
  }, [eventId, form, messageApi, navigate]);

  const onFinish = useCallback(
    async (values) => {
      setLoading(true);

      try {
        // Format dates to ISO strings
        const formattedValues = {
          ...values,
          startDate: values.startDate
            ? values.startDate.format("YYYY-MM-DD")
            : null,
          endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
          season: { id: values.seasonId },
          circuit: { id: values.circuitId },
        };

        // Remove separate IDs as they're now in nested objects
        delete formattedValues.seasonId;
        delete formattedValues.circuitId;

        await EventService.updateEvent(eventId, formattedValues);
        messageApi.success("Event updated successfully!");
        navigate("/admin/events");
      } catch (error) {
        console.error("Failed to update event:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to update event. Please try again.";
        messageApi.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [eventId, messageApi, navigate]
  );

  const handleCancel = useCallback(() => {
    navigate("/admin/events");
  }, [navigate]);

  return (
    <Spin spinning={fetchLoading || loading}>
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
            Update Event
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
          disabled={fetchLoading}
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
                Update Event
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminEventUpdate;
