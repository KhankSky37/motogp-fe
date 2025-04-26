import React, {useEffect, useState} from 'react';
import RiderService from '../../../services/RiderService.jsx'; // Corrected import path
import {Alert, Button, Spin, Table} from 'antd';
import {PlusOutlined} from "@ant-design/icons"; // Added Button for potential actions

const AdminRider = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10}); // Add pagination state

  useEffect(() => {
    const fetchRiders = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the RiderService to get all riders
        const response = await RiderService.getAllRiders();
        setRiders(response.data); // Assuming the data is in response.data
      } catch (err) {
        console.error("Error fetching riders:", err);
        setError("Failed to load rider data. Please check the console or try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRiders();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: 'No.',
      key: 'no',
      width: 60, // Optional: Set a fixed width
      render: (text, record, index) => {
        // Calculate row number based on current page and page size
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: 'ID',
      dataIndex: 'riderId',
      key: 'riderId',
      sorter: (a, b) => a.riderId.localeCompare(b.riderId), // Example sorter
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
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
    // Add Actions column if needed
    {
      title: 'Actions',
      key: 'actions',
      // render: (text, record) => (
      //   <span>
      //     <Button type="link"
      //             // onClick={() => handleEdit(record.riderId)}
      //     >Edit</Button>
      //     <Button type="link" danger
      //             // onClick={() => handleDelete(record.riderId)}
      //     >Delete</Button>
      //   </span>
      // ),
    },
  ];

  // Placeholder functions for actions (implement these based on your needs)
  // const handleEdit = (id) => { console.log('Edit rider:', id); /* Add edit logic */ };
  // const handleDelete = (id) => { console.log('Delete rider:', id); /* Add delete logic */ };


  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon/>;
  }

  return (
    <div>
      <div className={'flex justify-between items-center mb-4'}>
        <h2 className={'text-2xl font-medium'}>Rider Management</h2>
        {/* Add Button to create new rider */}
        <Button type="primary" className={"bg-blue-700"} onClick={() => console.log('Add new rider')}
                icon={<PlusOutlined/>}>
          Add Rider
        </Button>
      </div>
      <Spin spinning={loading}>
        <Table
          dataSource={riders}
          columns={columns}
          rowKey="riderId" // Use a unique key for each row, riderId seems appropriate
          bordered
          pagination={{pageSize: 10}} // Optional: Add pagination
          onChange={handleTableChange} // Handle pagination changes
          scroll={{x: 'max-content'}} // Optional: Enable horizontal scroll if content overflows
        />
      </Spin>
    </div>
  );
};

export default AdminRider;