import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TeamService from "../../../services/TeamService.jsx";
import { useNavigate } from "react-router-dom";
import TeamTable from "../../../components/admin/team/TeamTable.jsx";
import TeamDetailModal from "../../../components/admin/team/TeamDetailModal.jsx";
import TeamSearchForm from "../../../components/admin/team/TeamSearchForm.jsx";

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
  const [searchParams, setSearchParams] = useState({});

  const navigate = useNavigate();

  const fetchTeams = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
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
  }, []);

  useEffect(() => {
    fetchTeams(searchParams);
  }, [fetchTeams, searchParams]);

  const handleTableChange = (newPagination) => {
    const { current, pageSize } = newPagination;
    setPagination((prev) => ({
      ...prev,
      current: current,
      pageSize: pageSize,
    }));
  };

  const handleAdd = () => {
    navigate("/admin/teams/create");
  };

  const handleEdit = (teamId) => {
    navigate(`/admin/teams/update/${teamId}`);
  };

  const handleDelete = async (teamId) => {
    try {
      await TeamService.deleteTeam(teamId);
      messageApi.success("Team deleted successfully!");
      fetchTeams(searchParams); // Refresh the list
    } catch (error) {
      console.error("Error deleting team:", error);

      // More specific error messages for delete operation
      if (error.response) {
        if (error.response.status === 404) {
          messageApi.error("Team not found. It may have been already deleted.");
        } else if (error.response.status === 409) {
          messageApi.error(
            "This team cannot be deleted because it is referenced by other data."
          );
        } else {
          messageApi.error(
            `Failed to delete team: ${
              error.response.data?.message || "Unknown error"
            }`
          );
        }
      } else {
        messageApi.error(
          "Failed to delete team. Please check your network connection."
        );
      }
    }
  };

  const handleView = (record) => {
    setSelectedTeam(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedTeam(null);
  };

  const handleSearch = (values) => {
    setSearchParams(values);
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

      <TeamSearchForm onFinish={handleSearch} />

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
