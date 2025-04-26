import React, { useEffect, useState, useCallback } from 'react';
import {Alert, Button, message} from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import RiderService from "../../../services/RiderService.jsx";
import RiderTable from "../../../components/admin/rider/RiderTable.jsx";
import RiderDetailModal from "../../../components/admin/rider/RiderDetailModal.jsx";

const AdminRider = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchRiders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await RiderService.getAllRiders();
      setRiders(response.data);
    } catch (err) {
      console.error("Error fetching riders:", err);
      setError("Failed to load rider data. Please try again.");
      setRiders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRiders();
  }, [fetchRiders]);


  const handleTableChange = (newPagination, filters, sorter) => {
    console.log('Table changed:', newPagination, filters, sorter);
    const { current, pageSize } = newPagination;
    setPagination(prev => ({
      ...prev,
      current: current,
      pageSize: pageSize,
    }));
  };

  const handleAdd = () => {
    console.log("Add rider clicked");
  };

  const handleEdit = (riderId) => {
    console.log("Edit rider clicked:", riderId);
  };

  const handleDelete = async (riderId) => {
    try{
      await RiderService.deleteRider(riderId);
      messageApi.success("Delete rider successfully!");
      setRiders(prev => prev.filter(rider => rider.riderId !== riderId));
    }catch (error){
      console.error("Error deleting rider:", error);
    }
  };

  const handleView = (record) => {
    console.log("View rider clicked:", record);
    setSelectedRider(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRider(null);
  };

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon closable onClose={() => setError(null)} />;
  }

  return (
    <div>
      {contextHolder}
      <div className={'flex justify-between items-center mb-4'}>
        <h2 className={'text-2xl font-medium'}>Rider Management</h2>
        <Button
          type="primary"
          className={"bg-blue-700"}
          onClick={handleAdd}
          icon={<PlusOutlined />}
        >
          Add Rider
        </Button>
      </div>

      <RiderTable
        dataSource={riders}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <RiderDetailModal
        rider={selectedRider}
        visible={isModalVisible}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default AdminRider;