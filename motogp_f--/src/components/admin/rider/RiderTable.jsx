import React from 'react';
import {Button, Popconfirm, Spin, Table} from 'antd';
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {formatDate} from '../../../utils/formatters'; // Import helper

const safeStringSorter = (field) => (a, b) => {
  const valA = a[field] || '';
  const valB = b[field] || '';
  return valA.localeCompare(valB);
};

const RiderTable = ({
                      dataSource,
                      loading,
                      pagination,
                      onTableChange,
                      onView,
                      onEdit, // Placeholder for edit handler
                      onDelete // Placeholder for delete handler
                    }) => {

  const columns = [
    {
      title: 'No.',
      key: 'no',
      width: 60,
      render: (text, record, index) => {
        // Ensure pagination and pageSize exist before calculation
        const current = pagination?.current ?? 1;
        const pageSize = pagination?.pageSize ?? 10;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: 'ID',
      dataIndex: 'riderId',
      key: 'riderId',
      sorter: safeStringSorter('riderId'),
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: safeStringSorter('firstName'),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: safeStringSorter('lastName'),
    },
    {
      title: 'Nationality',
      dataIndex: 'nationality',
      key: 'nationality',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (text) => formatDate(text),
    },
    {
      title: 'Actions',
      key: 'Actions',
      align: 'center',
      render: (_, record) => (
        <span>
          <Button type="link" icon={<EyeOutlined className={"text-gray-400"}/>}
                  onClick={() => onView(record)}
          />
          <Button type="link" icon={<EditOutlined/>}
                  onClick={() => onEdit(record.riderId)}
          />
          <Popconfirm
            title="Delete Rider" // Use consistent text or constants
            description="Are you sure to delete this rider?"
            onConfirm={() => onDelete(record.riderId)} // Pass ID to delete handler
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined/>}/>
                    </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="riderId" // Ensure unique key
        bordered
        pagination={pagination} // Pass pagination state
        onChange={onTableChange} // Pass handler
        scroll={{x: 'max-content'}}
      />
    </Spin>
  );
};

export default RiderTable;