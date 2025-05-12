import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, Tooltip, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { formatDate } from '../../../utils/formatters'; // Assuming you have this

const ContractTable = ({
                         dataSource,
                         loading,
                         onView,
                         onEdit,
                         onDelete,
                         pagination,
                         onTableChange,
                       }) => {
  const [confirmLoading, setConfirmLoading] = useState({});

  const handleDeleteConfirm = async (id) => {
    setConfirmLoading(prev => ({ ...prev, [id]: true }));
    try {
      await onDelete(id);
    } finally {
      setConfirmLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const columns = [
    {
      title: 'No.',
      key: 'index',
      width: 60,
      render: (text, record, index) => {
        const { current = 1, pageSize = 10 } = pagination || {};
        return (current - 1) * pageSize + index + 1;
      },
    },
    // {
    //   title: 'Contract ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   sorter: (a, b) => a.id.localeCompare(b.id),
    // },
    {
      title: 'Team ID',
      dataIndex: 'teamId',
      key: 'teamId',
      // In a real app, you'd fetch and display Team Name
    },
    {
      title: 'Rider ID',
      dataIndex: 'riderId',
      key: 'riderId',
      // In a real app, you'd fetch and display Rider Name
    },
    {
      title: 'Season ID',
      dataIndex: 'seasonId',
      key: 'seasonId',
    },
    {
      title: 'Category ID',
      dataIndex: 'categoryId',
      key: 'categoryId',
    },
    {
      title: 'Rider Role',
      dataIndex: 'riderRole',
      key: 'riderRole',
      render: (role) => role ? <Tag>{role}</Tag> : '-',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (text) => text ? formatDate(text, 'YYYY-MM-DD HH:mm') : '-',
      responsive: ['md'],
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button icon={<EyeOutlined />} onClick={() => onView(record)} size="small" />
          </Tooltip>
          <Tooltip title="Edit Contract">
            <Button icon={<EditOutlined />} onClick={() => onEdit(record)} size="small" type="primary" />
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this contract?"
            onConfirm={() => handleDeleteConfirm(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ loading: confirmLoading[record.id] }}
          >
            <Tooltip title="Delete Contract">
              <Button icon={<DeleteOutlined />} size="small" danger />
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
      pagination={pagination}
      onChange={onTableChange}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default ContractTable;