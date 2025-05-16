import React from "react";
import {Button, Descriptions, Modal, Spin} from "antd";
import {formatDate, formatTime} from "../../../utils/formatters";

const ResultDetailModal = ({result, visible, onClose, loading = false}) => {
  if (!result) return null;

  return (
    <Modal
      title="Result Details"
      open={visible}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Session">
            {result?.sessionId}
          </Descriptions.Item>

          <Descriptions.Item label="Rider">
            {result.rider
              ? `${result.rider.firstName} ${result.rider.lastName}`
              : "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Team">
            {result.team?.name || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Manufacturer">
            {result.manufacturer?.name || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Position">
            {result.position || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Time">
            {formatTime(result.timeMillis)}
          </Descriptions.Item>

          <Descriptions.Item label="Gap">
            {formatTime(result.gapMillis)}
          </Descriptions.Item>

          <Descriptions.Item label="Laps">
            {result.laps || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            {result.status || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Created Date">
            {formatDate(result.createdDate)}
          </Descriptions.Item>

          <Descriptions.Item label="Created By">
            {result.createUser || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Modified Date">
            {formatDate(result.modifiedDate)}
          </Descriptions.Item>

          <Descriptions.Item label="Modified By">
            {result.modifiedUser || "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </Modal>
  );
};

export default ResultDetailModal;
