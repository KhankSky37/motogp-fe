import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Button, message} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import RiderService from "../../../services/RiderService.jsx";
import RiderTable from "../../../components/admin/rider/RiderTable.jsx";
import RiderDetailModal from "../../../components/admin/rider/RiderDetailModal.jsx";
import RiderSearchForm from "../../../components/admin/rider/RiderSearchForm.jsx";
import {useNavigate} from "react-router-dom";
import {COUNTRIES} from "../../../constants/Countries.jsx";
const countries = COUNTRIES;


const AdminRider = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const fetchRiders = useCallback(async (keyword = '', country = null) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        keyword: keyword,
        nationality: country,
      };

      const response = await RiderService.getAllRiders(params);
      setRiders(response.data);
      console.log("Fetched riders:", response);
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
    const {current, pageSize} = newPagination;
    setPagination(prev => ({
      ...prev,
      current: current,
      pageSize: pageSize,
    }));
  };

  const handleAdd = () => {
    console.log("Add rider clicked");
    navigate('/admin/riders/create');
  };

  const handleEdit = (riderId) => {
    navigate(`/admin/riders/update/${riderId}`);
  };

  const handleDelete = async (riderId) => {
    try {
      await RiderService.deleteRider(riderId);
      messageApi.success("Delete rider successfully!");
      setRiders(prev => prev.filter(rider => rider.riderId !== riderId));
    } catch (error) {
      console.error("Error deleting rider:", error);
      messageApi.error("Failed to delete rider. Please try again.");
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
    return <Alert message="Error" description={error} type="error" showIcon closable onClose={() => setError(null)}/>;
  }

  const onSearchFinish = (values) => {
    console.log("Search values:", values);
    fetchRiders(values.keyword, values.country);
  };

  return (
    <div>
      {contextHolder}
      <div className={'flex justify-between items-center mb-4'}>
        <h2 className={'text-2xl font-medium'}>Rider Management</h2>
        <Button
          type="primary"
          className={"bg-blue-700"}
          onClick={handleAdd}
          icon={<PlusOutlined/>}
        >
          Add Rider
        </Button>
      </div>
      <RiderSearchForm countries={countries} onFinish={onSearchFinish}/>

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