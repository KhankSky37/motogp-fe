import React from "react";
import { Button, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { formatTime } from "../../../utils/formatters";

const ResultTable = ({
  results,
  loading,
  onView,
  onEdit,
  onDelete,
  pagination,
  onTableChange,
}) => {
  const columns = [
    {
     title: "No.",
      key: "index",
      width: 60,
      render: (text, record, index) => {
        const current = pagination?.current ?? 1;
        const pageSize = pagination?.pageSize ?? 10;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Rider",
      dataIndex: ["rider"],
      key: "riderName",
      render: (rider) =>
        rider ? `${rider.firstName} ${rider.lastName}` : "N/A",
      sorter: (a, b) =>
        (a.rider?.lastName || "").localeCompare(b.rider?.lastName || ""),
    },
    {
      title: "Team",
      dataIndex: ["team", "name"],
      key: "teamName",
      render: (text, record) => record.team?.name || "N/A",
      sorter: (a, b) => (a.team?.name || "").localeCompare(b.team?.name || ""),
    },
    {
      title: "Manufacturer",
      dataIndex: ["manufacturer", "name"],
      key: "manufacturerName",
      render: (text, record) => record.manufacturer?.name || "N/A",
      sorter: (a, b) =>
        (a.manufacturer?.name || "").localeCompare(b.manufacturer?.name || ""),
    },
    {
      title: "Time",
      dataIndex: "timeMillis",
      key: "time",
      render: (timeMillis) => formatTime(timeMillis),
      sorter: (a, b) => a.timeMillis - b.timeMillis,
    },
    {
      title: "Gap",
      dataIndex: "gapMillis",
      key: "gap",
      render: (gapMillis) => formatTime(gapMillis),
    },
    {
      title: "Laps",
      dataIndex: "laps",
      key: "laps",
      sorter: (a, b) => a.laps - b.laps,
    },
       {
      title: "Position",
      dataIndex: "position",
      key: "position",
      sorter: (a, b) => a.position - b.position,
      width: 100,
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
      sorter: (a, b) => a.points - b.points,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        switch (status) {
          case "FINISHED":
            color = "green";
            break;
          case "DNF":
            color = "red";
            break;
          case "DNS":
            color = "orange";
            break;
          case "DSQ":
            color = "volcano";
            break;
        }
        return <Tag color={color}>{status}</Tag>;
      },
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
            title="Delete this result?"
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
    <Table
      columns={columns}
      dataSource={results}
      rowKey="id"
      loading={loading}
      pagination={pagination || { pageSize: 10 }}
      onChange={onTableChange}
      scroll={{ x: true }}
    />
  );
};

export default ResultTable;
