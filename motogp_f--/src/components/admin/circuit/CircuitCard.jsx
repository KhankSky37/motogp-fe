import React from "react";
import { Card, Typography, Button, Popconfirm, Space, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { COUNTRY_CODE_TO_FLAG_EMOJI } from "../../../constants/Countries.jsx";

const { Title, Text } = Typography;

const CircuitCard = ({ circuit, onEdit, onDelete }) => {
  const flagEmoji = COUNTRY_CODE_TO_FLAG_EMOJI[circuit.locationCountry] || "🏁";

  return (
    <Card
      className="circuit-card h-full"
      cover={
        <div
          style={{
            height: "200px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            alt={circuit.name}
            src={circuit.imageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      }
      actions={[
        <Button
          key="edit"
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit(circuit.id)}
          aria-label={`Edit ${circuit.name}`}
        >
          Edit
        </Button>,
        <Popconfirm
          key="delete"
          title="Delete this circuit?"
          description="Are you sure you want to delete this circuit?"
          onConfirm={() => onDelete(circuit.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            aria-label={`Delete ${circuit.name}`}
          >
            Delete
          </Button>
        </Popconfirm>,
      ]}
    >
      <Title level={4}>{circuit.name}</Title>
      <Space direction="vertical" size="small">
        <Space>
          <Text strong>Location:</Text>
          <Text>
            {flagEmoji} {circuit.locationCity}, {circuit.locationCountry}
          </Text>
        </Space>
        <Space>
          <Text strong>Length:</Text>
          <Tag color="blue">{circuit.lengthKm} km</Tag>
        </Space>
      </Space>
    </Card>
  );
};

export default CircuitCard;
