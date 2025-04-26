import React, {useEffect, useState} from 'react';
import RiderService from '../../../services/RiderService.jsx';
import {Alert, Button, Descriptions, Image, Modal, Popconfirm, Spin, Table} from 'antd';
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";

const AdminRider = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);

  useEffect(() => {
    const fetchRiders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await RiderService.getAllRiders();
        setRiders(response.data);
      } catch (err) {
        console.error("Error fetching riders:", err);
        setError("Failed to load rider data. Please check the console or try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRiders();
  }, []);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: 'No.',
      key: 'no',
      width: 60,
      render: (text, record, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: 'ID',
      dataIndex: 'riderId',
      key: 'riderId',
      sorter: (a, b) => a.riderId.localeCompare(b.riderId),
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: (a, b) => {
        const nameA = a.firstName || '';
        const nameB = b.firstName || '';
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: (a, b) => {
        const nameA = a.lastName || '';
        const nameB = b.lastName || '';
        return nameA.localeCompare(nameB);
      },
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
      render: (text) => text ? new Date(text).toLocaleDateString() : 'N/A', // Format date
    },
    {
      title: 'Actions',
      key: 'Actions',
      align: 'center',
      render: (_, record) => (
        <span>
          <Button type="link" icon={<EyeOutlined className={"text-gray-400"}/>}
                  onClick={() => handleView(record)}
          />
          <Button type="link" icon={<EditOutlined/>}
            // onClick={() => handleUpdate(record.groupId)}
          />
          <Popconfirm
            title="Xóa nhóm"
            description="Bạn có muốn xóa nhóm này không?"
            // onConfirm={() => handleDelete(record.groupId)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined/>}/>
          </Popconfirm>
        </span>
      ),
    },
  ];

  // Placeholder functions for actions (implement these based on your needs)
  // const handleEdit = (id) => { console.log('Edit rider:', id); /* Add edit logic */ };
  // const handleDelete = (id) => { console.log('Delete rider:', id); /* Add delete logic */ };
  const handleView = (record) => {
    console.log("View rider:", record);
    setIsModalVisible(true);
    setSelectedRider(record);
  };

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon/>;
  }

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRider(null);
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return new Date(dateString).toLocaleDateString();
      }
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const getImageUrl = (photoPath) => {
    if (!photoPath) return null;
    const baseUrl = ('http://localhost:9096').replace(/\/$/, "");
    const pathPrefix = '/api/v1';
    const relativePath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;

    return `${baseUrl}${pathPrefix}${relativePath}`;
  }


  return (
    <div>
      <div className={'flex justify-between items-center mb-4'}>
        <h2 className={'text-2xl font-medium'}>Rider Management</h2>
        <Button type="primary" className={"bg-blue-700"} onClick={() => console.log('Add new rider')}
                icon={<PlusOutlined/>}>
          Add Rider
        </Button>
      </div>
      <Spin spinning={loading}>
        <Table
          dataSource={riders}
          columns={columns}
          rowKey="riderId"
          bordered
          pagination={{pageSize: 10}}
          onChange={handleTableChange}
          scroll={{x: 'max-content'}}
        />
      </Spin>

      <Modal
        title="Rider Details"
        open={isModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalClose}>
            OK
          </Button>,
        ]}
        width={600}
      >
        {selectedRider && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Photo">
              {selectedRider.photoUrl ? (
                <Image width={100} src={getImageUrl(selectedRider.photoUrl)}
                       alt={`${selectedRider.firstName} ${selectedRider.lastName}`}
                />
              ) : (
                'No Photo Available'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Rider ID">{selectedRider.riderId}</Descriptions.Item>
            <Descriptions.Item label="First Name">{selectedRider.firstName}</Descriptions.Item>
            <Descriptions.Item label="Last Name">{selectedRider.lastName}</Descriptions.Item>
            <Descriptions.Item label="Nationality">{selectedRider.nationality}</Descriptions.Item>
            <Descriptions.Item label="Date of Birth">{formatDate(selectedRider.dateOfBirth)}</Descriptions.Item>
            <Descriptions.Item label="Created Date">{formatDate(selectedRider.createdDate)}</Descriptions.Item>
            <Descriptions.Item label="Create User">{selectedRider.createUser || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Modified Date">{formatDate(selectedRider.modifiedDate)}</Descriptions.Item>
            <Descriptions.Item label="Modified User">{selectedRider.modifiedUser || 'N/A'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default AdminRider;