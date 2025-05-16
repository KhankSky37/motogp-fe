import React, { useState } from "react";
import { Button, Popconfirm, Space, Table, Tag, message, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { formatDate } from "../../../utils/formatters";

import { COUNTRIES } from "../../../constants/Countries";

const ManufacturerTable = ({
  dataSource,
  loading,
  pagination,
  onTableChange,
  onView,
  onEdit,
  onDelete,
}) => {
  const [confirmLoading, setConfirmLoading] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
 
  

  const handleDelete = async (id) => {
    setConfirmLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await onDelete(id);
    } catch (error) {
      console.error("Error deleting manufacturer:", error);
      messageApi.error("Failed to delete manufacturer. Please try again.");
    } finally {
      setConfirmLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Hàm này lấy tên quốc gia từ mã quốc gia
  const getCountryName = (countryCode) => {
    if (!countryCode) return "Unknown";
    const country = COUNTRIES.find((c) => c.code === countryCode);
    return country ? country.name : countryCode;
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 60,
      render: (text, record, index) => {
        // Tính số thứ tự dựa vào pagination
        const { current = 1, pageSize = 10 } = pagination || {};
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Country",
      dataIndex: "locationCountry", // Sử dụng locationCountry thay vì country
      key: "locationCountry",
      render: (text) => <Tag color="blue">{getCountryName(text)}</Tag>,
      responsive: ["md"],
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => formatDate(text),
      sorter: (a, b) => {
        // Handle null, undefined, or invalid date values
        if (!a.createdDate) return -1;
        if (!b.createdDate) return 1;

        try {
          return new Date(a.createdDate) - new Date(b.createdDate);
        } catch (error) {
          console.error("Error sorting dates:", error);
          return 0;
        }
      },
      responsive: ["lg"],
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
            title="Delete this manufacturer?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={confirmLoading[record.id]}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        onChange={onTableChange}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default ManufacturerTable;
