import React from "react";
import { Button, Descriptions, Modal, Spin, Image } from "antd";
import { formatDate } from "../../../utils/formatters";
import { getImageUrl } from "../../../utils/urlHelpers";

const TeamDetailModal = ({ team, visible, onClose, loading = false }) => {
  if (!team) return null;

  return (
    <Modal
      title="Team Details"
      open={visible}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{team.id || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Name">
            {team.name || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Manufacturer">
            {team.manufacturer?.name || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {team.description || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Created Date">
            {formatDate(team.createdDate) || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {formatDate(team.modifiedDate) || "N/A"}
          </Descriptions.Item>
          {team.logoUrl && (
            <Descriptions.Item label="Team Logo">
              <Image
                src={getImageUrl(team.logoUrl)}
                alt={`${team.name} logo`}
                style={{ maxWidth: "100%", maxHeight: "200px" }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0"
              />
            </Descriptions.Item>
          )}
        </Descriptions>
      </Spin>
    </Modal>
  );
};

export default TeamDetailModal;
