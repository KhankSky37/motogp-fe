import React, { useState } from "react";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
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

  const handleDelete = async (id) => {
    setConfirmLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await onDelete(id);
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
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
      responsive: ["lg"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
            aria-label="View"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record.id)}
            aria-label="Edit"
          />
          <Popconfirm
            title="Are you sure you want to delete this manufacturer?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ loading: confirmLoading[record.id] }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={pagination}
      onChange={onTableChange}
      scroll={{ x: "max-content" }}
    />
  );
};

export default ManufacturerTable;
