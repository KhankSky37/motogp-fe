import React from "react";
import { Button, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { formatDateTime } from "../../../utils/formatters";

const SessionTable = ({
  sessions,
  loading,
  onView,
  onEdit,
  onDelete,
  pagination,
  onTableChange,
}) => {
  const columns = [
    {
      title: "Event",
      dataIndex: ["event", "name"],
      key: "eventName",
      render: (text, record) => record.event?.name || "-",
      sorter: (a, b) =>
        (a.event?.name || "").localeCompare(b.event?.name || ""),
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "categoryName",
      render: (text, record) => record.category?.name || "-",
      sorter: (a, b) =>
        (a.category?.name || "").localeCompare(b.category?.name || ""),
    },
    {
      title: "Session Type",
      dataIndex: "sessionType",
      key: "sessionType",
      render: (sessionType) => {
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
      },
      sorter: (a, b) =>
        (a.sessionType || "").localeCompare(b.sessionType || ""),
    },
    {
      title: "Date & Time",
      dataIndex: "sessionDatetime",
      key: "sessionDatetime",
      render: (datetime) => formatDateTime(datetime),
      sorter: (a, b) =>
        new Date(a.sessionDatetime) - new Date(b.sessionDatetime),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          {onView && (
            <Tooltip title="View">
              <Button
                type="default"
                icon={<EyeOutlined />}
                onClick={() => onView(record)}
                size="small"
              />
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => onEdit(record.id)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Delete this session?"
            description="This action cannot be undone."
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={sessions}
      rowKey="id"
      loading={loading}
      pagination={pagination || { pageSize: 10 }}
      onChange={onTableChange}
      scroll={{ x: true }}
    />
  );
};

export default SessionTable;
