import React, { useState } from "react";
import { Button, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { formatDate } from "../../../utils/formatters"; // Giả sử bạn có hàm này

const NewsArticleTable = ({
  dataSource,
  loading,
  pagination,
  onTableChange,
  onEdit,
  onDelete,
  onView,
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
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      ellipsis: true,
    },
    {
      title: "Article Type",
      dataIndex: "articleType",
      key: "articleType",
      width: 150,
      render: (type) => <Tag color="cyan">{type || "N/A"}</Tag>,
      responsive: ["sm"],
    },
    {
      title: "Publish Date",
      dataIndex: "publishDate",
      key: "publishDate",
      width: 180,
      render: (text) => (text ? formatDate(text, "YYYY-MM-DD HH:mm") : "-"),
      sorter: (a, b) => new Date(a.publishDate) - new Date(b.publishDate),
      responsive: ["lg"],
    },
    {
      title: "Article Link",
      dataIndex: "articleLink",
      key: "articleLink",
      ellipsis: true,
      render: (link) =>
        link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            {link}
          </a>
        ) : (
          "N/A"
        ),
      responsive: ["lg"],
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      align: "center",
      fixed: "right",
      render: (text, record) => (
        <Space size="small">
          {onView && (
            <Tooltip title="View Details">
              <Button
                type="default"
                icon={<EyeOutlined />}
                onClick={() => onView(record)}
                size="small"
              />
            </Tooltip>
          )}
          <Tooltip title="Edit Article">
            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => onEdit(record.id)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this article?"
            onConfirm={() => handleDeleteConfirm(record.id)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            okButtonProps={{ loading: confirmLoading[record.id] }}
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
      dataSource={dataSource}
      loading={loading}
      bordered
      pagination={{
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50"],
        showTotal: (total, range) =>
          `[${range[0]}-${range[1]}] - ${total} records`,
      }}
      onChange={onTableChange}
      rowKey="id"
      scroll={{ x: "max-content" }}
    />
  );
};

export default NewsArticleTable;
