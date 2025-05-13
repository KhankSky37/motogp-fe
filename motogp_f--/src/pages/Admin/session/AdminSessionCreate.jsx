import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Form, Select, DatePicker, Spin, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import SessionService from "../../../services/SessionService.jsx";
import EventService from "../../../services/EventService.jsx";
import CategoryService from "../../../services/CategoryService.jsx";

const { Option } = Select;

const AdminSessionCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch events and categories for dropdown menus
  useEffect(() => {
    const fetchData = async () => {
      try {
        setEventsLoading(true);
        setCategoriesLoading(true);

        const [eventsResponse, categoriesResponse] = await Promise.all([
          EventService.getAllEvents(),
          CategoryService.getAllCategories(),
        ]);

        setEvents(eventsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        messageApi.error("Failed to load data. Please refresh and try again.");
      } finally {
        setEventsLoading(false);
        setCategoriesLoading(false);
      }
    };

    fetchData();
  }, [messageApi]);

  const onFinish = useCallback(
    async (values) => {
      setLoading(true);
      try {
        // Format the datetime to ISO string
        const formattedValues = {
          ...values,
          sessionDatetime: values.sessionDatetime.toISOString(),
          event: { id: values.eventId },
          category: { categoryId: values.categoryId },
        };


        await SessionService.createSession(formattedValues);
        messageApi.success("Session created successfully!");
        form.resetFields();
        navigate("/admin/sessions");
      } catch (error) {
        console.error("Failed to create session:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to create session. Please try again.";
        messageApi.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [form, messageApi, navigate]
  );

  const handleCancel = useCallback(() => {
    navigate("/admin/sessions");
  }, [navigate]);

  // Get the selected event for display
  const selectedEventId = Form.useWatch("eventId", form);
  const selectedEvent = events.find((e) => e.id === selectedEventId);

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
            Create New Session
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
            name="eventId"
            label="Event"
            rules={[{ required: true, message: "Please select an event!" }]}
          >
            <Select
              placeholder="Select event"
              loading={eventsLoading}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {events.map((event) => (
                <Option key={event.id} value={event.id}>
                  {event.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedEvent && (
            <div className="mb-4 bg-gray-50 p-3 rounded-md ml-[25%]">
              <p>
                <strong>Circuit:</strong> {selectedEvent.circuit?.name || "N/A"}
              </p>
              <p>
                <strong>Season:</strong> {selectedEvent.season?.name || "N/A"}
              </p>
            </div>
          )}

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select placeholder="Select category" loading={categoriesLoading}>
              {categories.map((category) => (
                <Option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="sessionType"
            label="Session Type"
            rules={[
              { required: true, message: "Please select a session type!" },
            ]}
          >
            <Select placeholder="Select session type">
              <Option value="PRACTICE">Practice</Option>
              <Option value="QUALIFYING">Qualifying</Option>
              <Option value="RACE">Race</Option>
              <Option value="SPRINT">Sprint</Option>
              <Option value="WARM_UP">Warm Up</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="sessionDatetime"
            label="Date & Time"
            rules={[
              { required: true, message: "Please select date and time!" },
            ]}
          >
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              placeholder="Select date and time"
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
                Create Session
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminSessionCreate;
