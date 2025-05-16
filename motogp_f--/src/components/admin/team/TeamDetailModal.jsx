import React from "react";
import { Modal, Button, Descriptions, Image } from "antd";
import { formatDate } from "../../../utils/formatters";
import { getImageUrl } from "../../../utils/urlHelpers";

const TeamDetailModal = ({ team, visible, onClose }) => {
  if (!team) return null; // Don't render if no team data

  const logoUrl = getImageUrl(team.logoUrl);

  return (
    <Modal
      title="Team Details"
      open={visible}
      onOk={onClose} // Simple close on OK
      onCancel={onClose}
      footer={[
        <Button key="ok" type="primary" onClick={onClose}>
          OK
        </Button>,
      ]}
      width={600}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Logo">
          {logoUrl ? (
            <Image
              width={100}
              src={logoUrl}
              alt={`${team.name || ""} logo`}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0"
            />
          ) : (
            "No Logo Available"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="ID">{team.id || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Name">{team.name || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Manufacturer">
          {team.manufacturer?.name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Created Date">
          {formatDate(team.createdDate)}
        </Descriptions.Item>
        <Descriptions.Item label="Create User">
          {team.createUser || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Modified Date">
          {formatDate(team.modifiedDate)}
        </Descriptions.Item>
        <Descriptions.Item label="Modified User">
          {team.modifiedUser || "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default TeamDetailModal;
