import React from "react";
import { Button, Popconfirm, Spin, Table, Space, Tooltip, Image } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { formatDate } from "../../../utils/formatters";
import { getImageUrl } from "../../../utils/urlHelpers";

const safeStringSorter = (field) => (a, b) => {
  const valA = a[field] || "";
  const valB = b[field] || "";
  return valA.localeCompare(valB);
};

const CircuitTable = ({
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
      title: "Image",
      dataIndex: "imageUrl",
      key: "image",
      width: 100,
      render: (imageUrl) =>
        imageUrl ? (
          <Image
            src={getImageUrl(imageUrl)}
            alt="Circuit"
            style={{ width: 60, height: 60, objectFit: "cover" }}
            preview={{ mask: <EyeOutlined /> }}
          />
        ) : (
          "No image"
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: safeStringSorter("name"),
    },
    {
      title: "Country",
      dataIndex: "locationCountry",
      key: "locationCountry",
      sorter: safeStringSorter("locationCountry"),
    },
    {
      title: "City",
      dataIndex: "locationCity",
      key: "locationCity",
      sorter: safeStringSorter("locationCity"),
    },
    {
      title: "Length (km)",
      dataIndex: "lengthKm",
      key: "lengthKm",
      sorter: (a, b) => (a.lengthKm || 0) - (b.lengthKm || 0),
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
            title="Delete this circuit?"
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

export default CircuitTable;
