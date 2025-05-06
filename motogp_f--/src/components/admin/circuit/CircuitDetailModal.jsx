import React from "react";
import { Modal, Button, Descriptions, Image } from "antd";
import { formatDate } from "../../../utils/formatters";
import { getImageUrl } from "../../../utils/urlHelpers";

const CircuitDetailModal = ({ circuit, visible, onClose }) => {
  if (!circuit) return null; // Don't render if no circuit data

  const imageUrl = getImageUrl(circuit.imageUrl);

  return (
    <Modal
      title="Circuit Details"
      open={visible}
      onOk={onClose}
      onCancel={onClose}
      footer={[
        <Button key="ok" type="primary" onClick={onClose}>
          OK
        </Button>,
      ]}
      width={600}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Image">
          {imageUrl ? (
            <Image width={200} src={imageUrl} alt={circuit.name || "Circuit"} />
          ) : (
            "No Image Available"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Name">
          {circuit.name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="City">
          {circuit.locationCity || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Country">
          {circuit.locationCountry || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Length (km)">
          {circuit.lengthKm || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Created Date">
          {formatDate(circuit.createdDate)}
        </Descriptions.Item>
        <Descriptions.Item label="Created By">
          {circuit.createUser || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Modified Date">
          {formatDate(circuit.modifiedDate)}
        </Descriptions.Item>
        <Descriptions.Item label="Modified By">
          {circuit.modifiedUser || "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default CircuitDetailModal;
