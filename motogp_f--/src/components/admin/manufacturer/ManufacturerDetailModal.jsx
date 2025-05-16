import React from "react";
import { Modal, Button, Descriptions, Typography, Row, Col } from "antd";
import { formatDate } from "../../../utils/formatters";
import { COUNTRIES } from "../../../constants/Countries.jsx";

const { Title } = Typography;

const ManufacturerDetailModal = ({ manufacturer, visible, onClose }) => {
  if (!manufacturer) return null; // Don't render if no manufacturer data

  // Get country name from country code
  const getCountryName = (countryCode) => {
    const country = COUNTRIES.find((c) => c.code === countryCode);
    return country ? country.name : countryCode;
  };

  const countryName = getCountryName(manufacturer.locationCountry);

  return (
    <Modal
      title={<Title level={4}>Manufacturer Details</Title>}
      open={visible}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="close" type="primary" onClick={onClose} size="large">
          Close
        </Button>,
      ]}
      centered
    >
      <Row>
        <Col span={24}>
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="ID">
              {manufacturer.id || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Name">
              {manufacturer.name || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Country">
              {countryName || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {formatDate(manufacturer.createdDate) || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Created By">
              {manufacturer.createUser || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Last Modified">
              {formatDate(manufacturer.modifiedDate) || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Modified By">
              {manufacturer.modifiedUser || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Modal>
  );
};

export default ManufacturerDetailModal;
