import React, {useState} from 'react';
import {Button, Popconfirm, Space, Table, Tooltip, Typography} from 'antd';
import {DeleteOutlined, EditOutlined, EyeOutlined} from '@ant-design/icons';
import {formatDate} from '../../../utils/formatters'; // Assuming you have this

const {Text} = Typography;

const CategoryTable = ({
                         dataSource,
                         loading,
                         onView,
                         onEdit,
                         onDelete,
                         pagination, // Add pagination prop
                         onTableChange, // Add onTableChange prop
                       }) => {
  const [confirmLoading, setConfirmLoading] = useState({});

  const handleDeleteConfirm = async (id) => {
    setConfirmLoading(prev => ({...prev, [id]: true}));
    try {
      await onDelete(id);
    } finally {
      setConfirmLoading(prev => ({...prev, [id]: false}));
    }
  };

  const columns = [
    {
      title: 'No.',
      key: 'index',
      width: 60,
      render: (text, record, index) => {
        const {current = 1, pageSize = 10} = pagination || {};
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: 'Category ID',
      dataIndex: 'categoryId',
      key: 'categoryId',
      sorter: (a, b) => a.categoryId.localeCompare(b.categoryId),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      render: (text, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button icon={<EyeOutlined/>} onClick={() => onView(record)} size="small"/>
          </Tooltip>
          <Tooltip title="Edit Category">
            <Button icon={<EditOutlined/>} onClick={() => onEdit(record)} size="small" type="primary"/>
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDeleteConfirm(record.categoryId)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
            okButtonProps={{loading: confirmLoading[record.categoryId]}}
          >
            <Button icon={<DeleteOutlined/>} size="small" danger/>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      bordered
      loading={loading}
      rowKey="categoryId"
      pagination={pagination}
      onChange={onTableChange}
      scroll={{x: 'max-content'}}
    />
  );
};

export default CategoryTable;