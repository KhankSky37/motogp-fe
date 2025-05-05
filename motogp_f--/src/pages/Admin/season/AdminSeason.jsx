import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Button, message} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import SeasonService from "../../../services/SeasonService.jsx";
import SeasonTable from "../../../components/admin/season/SeasonTable.jsx";
import SeasonDetailModal from "../../../components/admin/season/SeasonDetailModal.jsx";
import SeasonSearchForm from "../../../components/admin/season/SeasonSearchForm.jsx";
import {useNavigate} from "react-router-dom";

const AdminSeason = () => {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const fetchSeasons = useCallback(async (keyword = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        keyword: keyword
      };

      const response = await SeasonService.getAllSeasons(params);
      setSeasons(response.data);
      console.log("Fetched seasons:", response);
    } catch (err) {
      console.error("Error fetching seasons:", err);
      setError("Failed to load season data. Please try again.");
      setSeasons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeasons();
  }, [fetchSeasons]);

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
    console.log("Add season clicked");
    navigate('/admin/seasons/create');
  };

  const handleEdit = (seasonId) => {
    navigate(`/admin/seasons/update/${seasonId}`);
  };

  const handleDelete = async (seasonId) => {
    try {
      await SeasonService.deleteSeason(seasonId);
      messageApi.success("Delete season successfully!");
      setSeasons(prev => prev.filter(season => season.id !== seasonId));
    } catch (error) {
      console.error("Error deleting season:", error);
      messageApi.error("Failed to delete season. Please try again.");
    }
  };

  const handleView = (record) => {
    console.log("View season clicked:", record);
    setSelectedSeason(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedSeason(null);
  };

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon closable onClose={() => setError(null)}/>;
  }

  const onSearchFinish = (values) => {
    console.log("Search values:", values);
    fetchSeasons(values.keyword);
  };

  return (
    <div>
      {contextHolder}
      <div className={'flex justify-between items-center mb-4'}>
        <h2 className={'text-2xl font-medium'}>Season Management</h2>
        <Button
          type="primary"
          className={"bg-blue-700"}
          onClick={handleAdd}
          icon={<PlusOutlined/>}
        >
          Add Season
        </Button>
      </div>
      <SeasonSearchForm onFinish={onSearchFinish}/>

      <SeasonTable
        dataSource={seasons}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <SeasonDetailModal
        season={selectedSeason}
        visible={isModalVisible}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default AdminSeason;