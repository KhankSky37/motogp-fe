import React from 'react';
import {Button, Popconfirm, Spin, Table} from 'antd';
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {formatDate} from '../../../utils/formatters';

const safeStringSorter = (field) => (a, b) => {
  const valA = a[field] || '';
  const valB = b[field] || '';
  return valA.localeCompare(valB);
};

const SeasonTable = ({
                       dataSource,
                       loading,
                       pagination,
                       onTableChange,
                       onView,
                       onEdit,
                       onDelete
                     }) => {

  const columns = [
    {
      title: 'No.',
      key: 'no',
      width: 60,
      render: (text, record, index) => {
        const current = pagination?.current ?? 1;
        const pageSize = pagination?.pageSize ?? 10;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: safeStringSorter('name'),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
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
                  onClick={() => onEdit(record.id)}
          />
          <Popconfirm
            title="Delete Season"
            description="Are you sure to delete this season?"
            onConfirm={() => onDelete(record.id)}
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
        rowKey="id"
        bordered
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `[${range[0]}-${range[1]}] - ${total} records`,
        }}
        onChange={onTableChange}
        scroll={{x: 'max-content'}}
      />
    </Spin>
  );
};

export default SeasonTable;