import React from "react";
import { Button, Popconfirm, Spin, Table, Space, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { formatDate } from "../../../utils/formatters";
import {COUNTRIES} from "../../../constants/Countries.jsx"; // Import helper

const safeStringSorter = (field) => (a, b) => {
  const valA = a[field] || "";
  const valB = b[field] || "";
  return valA.localeCompare(valB);
};

const RiderTable = ({
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
      title: "ID",
      dataIndex: "riderId",
      key: "riderId",
      sorter: safeStringSorter("riderId"),
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      sorter: safeStringSorter("firstName"),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      sorter: safeStringSorter("lastName"),
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "nationality",
      render: (text) => getCountryName(text),
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
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
              onClick={() => onEdit(record.riderId)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Delete this rider?"
            description="This action cannot be undone."
            onConfirm={() => onDelete(record.riderId)}
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
  const getCountryName = (countryCode) => {
    if (!countryCode) return "Unknown";
    const country = COUNTRIES.find((c) => c.code === countryCode);
    return country ? country.name : countryCode;
  };
  return (
    <Spin spinning={loading}>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="riderId" // Ensure unique key
        bordered
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) =>
            `[${range[0]}-${range[1]}] - ${total} records`,
        }}
        onChange={onTableChange}
        scroll={{ x: "max-content" }}
      />
    </Spin>
  );
};

export default RiderTable;
