import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SessionService from "../../../services/SessionService.jsx";
import EventService from "../../../services/EventService.jsx";
import CategoryService from "../../../services/CategoryService.jsx";
import SessionTable from "../../../components/admin/session/SessionTable.jsx";
import SessionDetailModal from "../../../components/admin/session/SessionDetailModal.jsx";
import SessionSearchForm from "../../../components/admin/session/SessionSearchForm.jsx";
import { useNavigate } from "react-router-dom";

const AdminSession = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams, setSearchParams] = useState({});
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formLoading, setFormLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch dropdown options for search form
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setFormLoading(true);
        const [eventsResponse, categoriesResponse] = await Promise.all([
          EventService.getAllEvents(),
          CategoryService.getAllCategories(),
        ]);
        setEvents(eventsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching form data:", error);
        messageApi.error(
          "Failed to load form data. The search form may have limited functionality."
        );
      } finally {
        setFormLoading(false);
      }
    };

    fetchFormData();
  }, [messageApi]);

  const fetchSessions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await SessionService.getAllSessions(params);
      setSessions(response.data);
      console.log("Fetched sessions:", response);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to load session data. Please try again.");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions(searchParams);
  }, [fetchSessions, searchParams]);

  const handleTableChange = (newPagination) => {
    const { current, pageSize } = newPagination;
    setPagination((prev) => ({
      ...prev,
      current: current,
      pageSize: pageSize,
    }));
  };

  const handleAdd = () => {
    navigate("/admin/sessions/create");
  };

  const handleEdit = (sessionId) => {
    navigate(`/admin/sessions/update/${sessionId}`);
  };

  const handleDelete = async (sessionId) => {
    try {
      await SessionService.deleteSession(sessionId);
      messageApi.success("Session deleted successfully!");
      fetchSessions(searchParams); // Refresh the list
    } catch (error) {
      console.error("Error deleting session:", error);

      // More specific error messages for delete operation
      if (error.response) {
        if (error.response.status === 404) {
          messageApi.error(
            "Session not found. It may have been already deleted."
          );
        } else if (error.response.status === 409) {
          messageApi.error(
            "This session cannot be deleted because it is referenced by other data."
          );
        } else {
          messageApi.error(
            `Failed to delete session: ${
              error.response.data?.message || "Unknown error"
            }`
          );
        }
      } else {
        messageApi.error(
          "Failed to delete session. Please check your network connection."
        );
      }
    }
  };

  const handleView = (record) => {
    setSelectedSession(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedSession(null);
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
        <h2 className={"text-2xl font-medium"}>Session Management</h2>
        <Button
          type="primary"
          className={"bg-blue-700"}
          onClick={handleAdd}
          icon={<PlusOutlined />}
        >
          Add Session
        </Button>
      </div>

      <SessionSearchForm
        onSearch={handleSearch}
        events={events}
        categories={categories}
        loading={formLoading}
      />

      <SessionTable
        sessions={sessions}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <SessionDetailModal
        visible={isModalVisible}
        onCancel={handleModalClose}
        session={selectedSession}
        events={events}
        categories={categories}
        viewOnly={true}
      />
    </div>
  );
};

export default AdminSession;
