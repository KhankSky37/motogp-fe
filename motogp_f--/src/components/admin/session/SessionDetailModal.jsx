import React, {useEffect} from "react";
import {Button, Descriptions, Form, Modal, Select,} from "antd";
import moment from "moment";
import {formatDateTime} from "../../../utils/formatters";

const {Option} = Select;

const SessionDetailModal = ({
                              visible,
                              onCancel,
                              session,
                              viewOnly = false,
                            }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && session && !viewOnly) {
      let eventId = null;
      if (session.event) {
        eventId = session.event.id;
      }

      form.setFieldsValue({
        ...session,
        eventId: eventId,
        categoryId: session.category?.id,
        sessionDatetime: session.sessionDatetime
          ? moment(session.sessionDatetime)
          : null,
      });
    } else if (visible && !viewOnly) {
      form.resetFields();
    }
  }, [visible, session, form, viewOnly]);

  if (viewOnly && session) {
    return (
      <Modal
        title={'Session Details'}
        open={visible}
        onCancel={onCancel}
        width={600}
        footer={[
          <Button key="close" onClick={onCancel}>
            Close
          </Button>,
        ]}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Event">
            {session.event?.name || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Category">
            {session.category?.name || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Session Type">
            {session.sessionType || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Date & Time">
            {formatDateTime(session.sessionDatetime) || "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    );
  }
};

export default SessionDetailModal;
