import React, { useState } from "react";
import { Button, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { formatDate } from "../../../utils/formatters"; // Assuming you have this

const ContractTable = ({
  dataSource,
  loading,
  onView,
  onEdit,
  onDelete,
  pagination,
  onTableChange,
  teamsMap,
  ridersMap,
}) => {
  const [confirmLoading, setConfirmLoading] = useState({});

  const handleDeleteConfirm = async (id) => {
    setConfirmLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await onDelete(id);
    } finally {
      setConfirmLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 60,
      render: (text, record, index) => {
        const { current = 1, pageSize = 10 } = pagination || {};
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Team", // Đổi title
      dataIndex: "teamId",
      key: "teamId",
      render: (teamId) =>
        teamsMap && teamsMap[teamId] ? teamsMap[teamId] : teamId, // Sử dụng map
    },
    {
      title: "Rider", // Đổi title
      dataIndex: "riderId",
      key: "riderId",
      render: (riderId) =>
        ridersMap && ridersMap[riderId] ? ridersMap[riderId] : riderId, // Sử dụng map
    },
    {
      title: "Season ID",
      dataIndex: "seasonId",
      key: "seasonId",
    },
    {
      title: "Category ID",
      dataIndex: "categoryId",
      key: "categoryId",
    },
    {
      title: "Rider Role",
      dataIndex: "riderRole",
      key: "riderRole",
      render: (role) => (role ? <Tag>{role}</Tag> : "-"),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => (text ? formatDate(text, "YYYY-MM-DD HH:mm") : "-"),
      responsive: ["md"],
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      align: "center",
      fixed: "right",
      render: (text, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              size="small"
              className="view-btn"
            />
          </Tooltip>
          <Tooltip title="Edit Contract">
            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              size="small"
              className="edit-btn"
            />
          </Tooltip>{" "}
          <Popconfirm
            title="Delete this contract?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteConfirm(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            okButtonProps={{ loading: confirmLoading[record.id] }}
          >
            <Tooltip title="Delete Contract">
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                className="delete-btn"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey="id"
      bordered
      pagination={{
        ...pagination,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50"],
        showTotal: (total, range) =>
          `[${range[0]}-${range[1]}] - ${total} records`,
      }}
      onChange={onTableChange}
      scroll={{ x: "max-content" }}
      className="contract-table"
    />
  );
};

export default ContractTable;
