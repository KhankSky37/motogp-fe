import React, {useState} from 'react';
import {Table, Button, Space, Popconfirm, Tag, Tooltip} from 'antd';
import {EditOutlined, DeleteOutlined, EyeOutlined} from '@ant-design/icons';
import {formatDate} from '../../../utils/formatters'; // Giả sử bạn có hàm này

const UserTable = ({
                     dataSource,
                     loading,
                     pagination,
                     onTableChange,
                     onEdit,
                     onDelete,
                     onView, // Thêm prop onView nếu cần
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Nickname',
      dataIndex: 'nickname',
      key: 'nickname',
      responsive: ['md'],
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        let color = 'default';
        if (role?.toLowerCase() === 'admin') {
          color = 'volcano';
        } else if (role?.toLowerCase() === 'user') {
          color = 'green';
        }
        return <Tag color={color}>{role?.toUpperCase()}</Tag>;
      },
      responsive: ['md'],
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      responsive: ['lg'],
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dataOfBirth', // Sửa thành dataOfBirth
      key: 'dataOfBirth',
      render: (text) => text ? formatDate(text, 'YYYY-MM-DD') : '-', // Sử dụng formatDate
      responsive: ['lg'],
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
          <Tooltip title="Edit User">
            <Button icon={<EditOutlined/>} onClick={() => onEdit(record.id)} size="small" type="primary"/>
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDeleteConfirm(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{loading: confirmLoading[record.id]}}
          >
            <Tooltip title="Delete User">
              <Button icon={<DeleteOutlined/>} size="small" danger/>
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
      pagination={pagination}
      onChange={onTableChange}
      rowKey="id"
      scroll={{x: 'max-content'}}
    />
  );
};

export default UserTable;