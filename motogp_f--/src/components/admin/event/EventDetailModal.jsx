import React from "react";
import { Modal, Button, Descriptions } from "antd";
import { formatDate } from "../../../utils/formatters";

const EventDetailModal = ({ event, visible, onCancel = true }) => {
  if (!event) return null;

  return (
    <Modal
      title="Event Details"
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{event.id || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Name">
          {event.name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Official Name">
          {event.officialName || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Season">
          {event.season?.name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Circuit">
          {event.circuit?.name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Event Type">
          {event.eventType || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Start Date">
          {formatDate(event.startDate) || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="End Date">
          {formatDate(event.endDate) || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Created Date">
          {formatDate(event.createdDate) || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Created By">
          {event.createUser || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Modified Date">
          {formatDate(event.modifiedDate) || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Modified By">
          {event.modifiedUser || "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default EventDetailModal;
