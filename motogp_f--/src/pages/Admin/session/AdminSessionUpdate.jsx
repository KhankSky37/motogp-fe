import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Form, Select, DatePicker, Spin, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import SessionService from "../../../services/SessionService.jsx";
import EventService from "../../../services/EventService.jsx";
import CategoryService from "../../../services/CategoryService.jsx";

const { Option } = Select;

const AdminSessionUpdate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [originalSession, setOriginalSession] = useState(null);

  // Fetch session data and options for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        setEventsLoading(true);
        setCategoriesLoading(true);

        // Fetch session data and dropdown options in parallel
        const [sessionResponse, eventsResponse, categoriesResponse] =
          await Promise.all([
            SessionService.getSessionById(sessionId),
            EventService.getAllEvents(),
            CategoryService.getAllCategories(),
          ]);

        // Set dropdown options
        setEvents(eventsResponse.data);
        setCategories(categoriesResponse.data);

        // Set form values from session data
        const sessionData = sessionResponse.data;
        console.log("Fetched session data:", sessionData);

        // Lưu session gốc để cập nhật
        setOriginalSession(sessionData);

        // Handle both cases - when event exists or is undefined
        let eventId = null;
        if (sessionData.event) {
          eventId = sessionData.event.id;
        }

        // Lấy categoryId thay vì id để khớp với dữ liệu của category
        const categoryId = sessionData.category?.categoryId;
        console.log("Extracted category ID:", categoryId);

        form.setFieldsValue({
          eventId: eventId,
          categoryId: categoryId,
          sessionType: sessionData.sessionType,
          sessionDatetime: sessionData.sessionDatetime
            ? moment(sessionData.sessionDatetime)
            : null,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        messageApi.error("Failed to load session data. Please try again.");
      } finally {
        setFetchLoading(false);
        setEventsLoading(false);
        setCategoriesLoading(false);
      }
    };

    if (sessionId) {
      fetchData();
    }
  }, [sessionId, form, messageApi]);

  const onFinish = useCallback(
    async (values) => {
      setLoading(true);

      try {
        // Format the datetime to ISO string
        const formattedValues = {
          id: sessionId, // Thêm id để đảm bảo cập nhật đúng record
          ...values,
          sessionDatetime: values.sessionDatetime.toISOString(),
          event: { id: values.eventId },
          category: { categoryId: values.categoryId },
        };

        // Ghi đè các trường khác từ session gốc để đảm bảo không mất thông tin
        if (originalSession) {
          // Giữ lại các trường quan trọng khác từ session gốc
          formattedValues.createUser = originalSession.createUser;
          formattedValues.createdDate = originalSession.createdDate;
        }

        console.log("Updating session with data:", formattedValues);

        // Remove separate IDs as they're now in nested objects
        delete formattedValues.eventId;
        delete formattedValues.categoryId;

        await SessionService.updateSession(sessionId, formattedValues);
        messageApi.success("Session updated successfully!", 0.5, () => {
          navigate("/admin/sessions");
        });
      } catch (error) {
        console.error("Failed to update session:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to update session. Please try again.";
        messageApi.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [sessionId, messageApi, navigate, originalSession]
  );

  const handleCancel = useCallback(() => {
    navigate("/admin/sessions");
  }, [navigate]);

  // Get the selected event for display
  const selectedEventId = Form.useWatch("eventId", form);
  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <Spin spinning={loading || fetchLoading}>
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
            Update Session
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
          )}{" "}
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select
              placeholder="Select category"
              loading={categoriesLoading}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
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
          </Form.Item>{" "}
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
                Update Session
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminSessionUpdate;
