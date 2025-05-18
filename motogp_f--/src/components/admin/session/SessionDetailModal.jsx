import React, { useEffect } from "react";
import {
  Button,
  DatePicker,
  Form,
  Modal,
  Select,
  Spin,
  Descriptions,
  Tag,
} from "antd";
import moment from "moment";
import { formatDateTime } from "../../../utils/formatters";

const { Option } = Select;

const SessionDetailModal = ({
  visible,
  onCancel,
  onSave,
  loading,
  session,
  events = [],
  categories = [],
  eventsLoading = false,
  categoriesLoading = false,
  viewOnly = true,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!session?.id;
  useEffect(() => {
    if (visible && session && !viewOnly) {
      // Handle the form data setup for existing session
      form.setFieldsValue({
        ...session,
        categoryId: session.category?.id,
        sessionDatetime: session.sessionDatetime
          ? moment(session.sessionDatetime)
          : null,
      });
    } else if (visible && !viewOnly) {
      form.resetFields();
    }
  }, [visible, session, form, viewOnly]);
  // Helper function to render session type with appropriate color
  const renderSessionTypeTag = (sessionType) => {
    let color = "default";
    switch (sessionType) {
      case "PRACTICE":
        color = "blue";
        break;
      case "QUALIFYING":
        color = "purple";
        break;
      case "RACE":
        color = "red";
        break;
      case "SPRINT":
        color = "orange";
        break;
      case "WARM_UP":
        color = "green";
        break;
    }
    return <Tag color={color}>{sessionType}</Tag>;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Format the datetime to ISO string
      if (values.sessionDatetime) {
        values.sessionDatetime = values.sessionDatetime.toISOString();
      }

      // Prepare the session object
      const sessionData = {
        ...values,
        id: session?.id,
        event: { id: values.eventId },
        category: { id: values.categoryId },
      };

      // Remove the separate IDs as they're now in the nested objects
      delete sessionData.eventId;
      delete sessionData.categoryId;

      onSave(sessionData);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const modalTitle = viewOnly
    ? "Session Details"
    : isEdit
    ? "Edit Session"
    : "Add Session";

  // In view-only mode, display session details without form
  if (viewOnly && session) {
    return (
      <Modal
        title={"Session Details"}
        open={visible}
        onCancel={onCancel}
        width={600}
        footer={[
          <Button key="close" onClick={onCancel}>
            Close
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Event">
              {session.event?.name || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {session.category?.name || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Session Type">
              {session.sessionType
                ? renderSessionTypeTag(session.sessionType)
                : "N/A"} 
            </Descriptions.Item>
            <Descriptions.Item label="Date & Time">
              {formatDateTime(session.sessionDatetime) || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Created By">{session.createUser || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Modified Date">{formatDateTime(session.modifiedDate)}</Descriptions.Item>
            <Descriptions.Item label="Modified By">{session.modifiedUser || 'N/A'}</Descriptions.Item>
          </Descriptions>
        </Spin>
      </Modal>
    );
  }

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          Save
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="eventId"
            label="Event"
            rules={[{ required: true, message: "Please select an event" }]}
          >
            <Select
              placeholder="Select event"
              loading={eventsLoading}
              disabled={loading}
            >
              {events.map((event) => (
                <Option key={event.id} value={event.id}>
                  {event.name}
                </Option>
              ))}
            </Select>
          </Form.Item>{" "}
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              placeholder="Select category"
              loading={categoriesLoading}
              disabled={loading}
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="sessionType"
            label="Session Type"
            rules={[
              { required: true, message: "Please select a session type" },
            ]}
          >
            <Select placeholder="Select session type" disabled={loading}>
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
            rules={[{ required: true, message: "Please select date and time" }]}
          >
            <DatePicker
              className="w-full"
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              placeholder="Select date and time"
              disabled={loading}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default SessionDetailModal;
