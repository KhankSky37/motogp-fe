import React from "react";
import { Button, Popconfirm, Spin, Table, Space, Tooltip, Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { formatDate } from "../../../utils/formatters";

const safeStringSorter = (field) => (a, b) => {
  const valA = a[field] || "";
  const valB = b[field] || "";
  return valA.localeCompare(valB);
};

const EventTable = ({
  events,
  loading,
  pagination,
  onTableChange,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "No.",
      key: "no",
      width: 60,
      render: (text, record, index) => {
        const current = pagination?.current ?? 1;
        const pageSize = pagination?.pageSize ?? 10;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: safeStringSorter("id"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: safeStringSorter("name"),
    },
    {
      title: "Official Name",
      dataIndex: "officialName",
      key: "officialName",
      sorter: safeStringSorter("officialName"),
    },
    {
      title: "Season",
      dataIndex: "season",
      key: "season",
      render: (season) => season?.name || "N/A",
      sorter: (a, b) =>
        (a.season?.name || "").localeCompare(b.season?.name || ""),
    },
    {
      title: "Circuit",
      dataIndex: "circuit",
      key: "circuit",
      render: (circuit) => circuit?.name || "N/A",
      sorter: (a, b) =>
        (a.circuit?.name || "").localeCompare(b.circuit?.name || ""),
    },
    {
      title: "Event Type",
      dataIndex: "eventType",
      key: "eventType",
      render: (eventType) => {
        let color = "default";
        switch (eventType) {
          case "RACE":
            color = "red";
            break;
          case "TEST":
            color = "blue";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{eventType}</Tag>;
      },
      sorter: safeStringSorter("eventType"),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
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
            title="Delete this event?"
            description="This action cannot be undone."
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Table
        dataSource={events}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={onTableChange}
        scroll={{ x: "max-content" }}
      />
    </Spin>
  );
};

export default EventTable;
