import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TeamService from "../../../services/TeamService.jsx";
import TeamTable from "../../../components/admin/team/TeamTable.jsx";
import TeamDetailModal from "../../../components/admin/team/TeamDetailModal.jsx";
import TeamSearchForm from "../../../components/admin/team/TeamSearchForm.jsx";
import { useNavigate } from "react-router-dom";
import ManufacturerService from "../../../services/ManufacturerService.jsx";

const AdminTeam = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [manufacturers, setManufacturers] = useState([]);

  const navigate = useNavigate();
  const fetchTeams = useCallback(
    async (keyword = "", manufacturerId = null) => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          keyword: keyword,
          manufacturerId: manufacturerId,
        };

        const response = await TeamService.getAllTeams(params);
        setTeams(response.data);
        console.log("Fetched teams:", response);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to load team data. Please try again.");
        setTeams([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchTeams();
    // Fetch manufacturers for the search form
    const fetchManufacturers = async () => {
      try {
        const response = await ManufacturerService.getAllManufacturers();
        setManufacturers(response.data || []);
      } catch (error) {
        console.error("Failed to fetch manufacturers:", error);
      }
    };
    fetchManufacturers();
  }, [fetchTeams]);

  const handleTableChange = (newPagination, filters, sorter) => {
    console.log("Table changed:", newPagination, filters, sorter);
    const { current, pageSize } = newPagination;
    setPagination((prev) => ({
      ...prev,
      current: current,
      pageSize: pageSize,
    }));
  };

  const handleAdd = () => {
    console.log("Add team clicked");
    navigate("/admin/teams/create");
  };

  const handleEdit = (teamId) => {
    navigate(`/admin/teams/update/${teamId}`);
  };

  const handleDelete = async (teamId) => {
    try {
      await TeamService.deleteTeam(teamId);
      messageApi.success("Delete team successfully!");
      setTeams((prev) => prev.filter((team) => team.id !== teamId));
    } catch (error) {
      console.error("Error deleting team:", error);
      messageApi.error("Failed to delete team. Please try again.");
    }
  };

  const handleView = (record) => {
    console.log("View team clicked:", record);
    setSelectedTeam(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedTeam(null);
  };

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        closable
        onClose={() => setError(null)}
      />
    );
  }

  const onSearchFinish = (values) => {
    console.log("Search values:", values);
    fetchTeams(values.keyword, values.manufacturerId);
  };

  return (
    <div>
      {contextHolder}
      <div className={"flex justify-between items-center mb-4"}>
        <h2 className={"text-2xl font-medium"}>Team Management</h2>
        <Button
          type="primary"
          className={"bg-blue-700"}
          onClick={handleAdd}
          icon={<PlusOutlined />}
        >
          Add Team
        </Button>
      </div>
      <TeamSearchForm manufacturers={manufacturers} onFinish={onSearchFinish} />

      <TeamTable
        dataSource={teams}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TeamDetailModal
        team={selectedTeam}
        visible={isModalVisible}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default AdminTeam;
