import React from "react";
import { Button, Popconfirm, Spin, Table, Space, Tooltip, Avatar } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { formatDate } from "../../../utils/formatters";
import { getImageUrl } from "../../../utils/urlHelpers";

// Helper function for safer string sorting
const safeStringSorter = (field) => (a, b) => {
  const valA = a[field] || "";
  const valB = b[field] || "";
  return valA.localeCompare(valB);
};

const TeamTable = ({
  dataSource,
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
      title: "Logo",
      dataIndex: "logoUrl",
      key: "logo",
      width: 80,
      render: (logoUrl, record) => (
        <Avatar
          src={logoUrl ? getImageUrl(logoUrl) : null}
          alt={record.name}
          shape="square"
          size="large"
        >
          {!logoUrl && record.name ? record.name.charAt(0) : "T"}
        </Avatar>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: safeStringSorter("name"),
    },
    {
      title: "Manufacturer",
      dataIndex: ["manufacturer", "name"],
      key: "manufacturer",
      render: (text, record) => record.manufacturer?.name || "N/A",
      sorter: (a, b) => {
        const nameA = a.manufacturer?.name || "";
        const nameB = b.manufacturer?.name || "";
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => formatDate(text),
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
            title="Delete this team?"
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
        dataSource={dataSource}
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

export default TeamTable;
