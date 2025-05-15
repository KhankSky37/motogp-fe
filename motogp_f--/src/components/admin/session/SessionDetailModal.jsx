import React, { useEffect, useState } from "react";
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
  categories = [],
  categoriesLoading = false,
  viewOnly = false,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!session?.id;
  const [localLoading, setLocalLoading] = useState(loading);

  useEffect(() => {
    setLocalLoading(loading);

    if (visible) {
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [visible, loading]);

  useEffect(() => {
    if (visible && session && !viewOnly) {
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

      if (values.sessionDatetime) {
        values.sessionDatetime = values.sessionDatetime.toISOString();
      }

      if (!values.categoryId) {
        form.setFields([
          {
            name: "categoryId",
            errors: ["Please select a category"],
          },
        ]);
        return;
      }

      const sessionData = {
        ...values,
        id: session?.id,
        category: { categoryId: values.categoryId },
      };

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

  if (viewOnly && session) {
    return (
      <Modal
        title={modalTitle}
        open={visible}
        onCancel={onCancel}
        width={600}
        footer={[
          <Button key="close" onClick={onCancel}>
            Close
          </Button>,
        ]}
      >
        <Spin spinning={localLoading}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Category">
              {session.category?.name || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Session Type">
              {renderSessionTypeTag(session.sessionType) || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Date & Time">
              {formatDateTime(session.sessionDatetime) || "N/A"}
            </Descriptions.Item>
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
          loading={localLoading}
        >
          Save
        </Button>,
      ]}
    >
      <Spin spinning={localLoading}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              placeholder="Select category"
              loading={categoriesLoading}
              disabled={loading}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
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
