import React from "react";
import { Modal, Descriptions, Tag } from "antd";
import { formatDate } from "../../../utils/formatters";

const ContractDetailModal = ({ contract, visible, onClose }) => {
  if (!contract) {
    return null;
  }

  return (
    <Modal
      title="Contract Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Contract ID">
          {contract.id || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Team ID">
          {contract.teamId || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Rider ID">
          {contract.riderId || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Season ID">
          {contract.seasonId || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Category ID">
          {contract.categoryId || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Rider Role">
          {contract.riderRole ? <Tag>{contract.riderRole}</Tag> : "N/A"}
        </Descriptions.Item>{" "}
        <Descriptions.Item label="Created Date">
          {contract.createdDate
            ? formatDate(contract.createdDate, "YYYY-MM-DD HH:mm:ss")
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Created By">
          {contract.createUser || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Last Modified Date">
          {contract.modifiedDate
            ? formatDate(contract.modifiedDate, "YYYY-MM-DD HH:mm:ss")
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Last Modified By">
          {contract.modifiedUser || "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ContractDetailModal;
