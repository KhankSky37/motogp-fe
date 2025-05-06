import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SessionService from "../../services/SessionService.jsx";
import EventService from "../../services/EventService.jsx";
import CategoryService from "../../services/CategoryService.jsx";
import SessionTable from "../../components/admin/session/SessionTable.jsx";
import SessionDetailModal from "../../components/admin/session/SessionDetailModal.jsx";
import SessionSearchForm from "../../components/admin/session/SessionSearchForm.jsx";
import { useNavigate } from "react-router-dom";

const AdminSession = () => {
  const [sessions, setSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
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

  const navigate = useNavigate();

  // Fetch events and categories for search dropdowns
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [eventsResponse, categoriesResponse] = await Promise.all([
          EventService.getAllEvents({}),
          CategoryService.getAllCategories(),
        ]);

        setEvents(eventsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };

    fetchDropdownData();
  }, []);

  const fetchSessions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Format the date parameters correctly
      const formattedParams = { ...params };
      if (params.dateFrom) {
        formattedParams.dateFrom = params.dateFrom.toISOString();
      }
      if (params.dateTo) {
        formattedParams.dateTo = params.dateTo.toISOString();
      }

      const response = await SessionService.getAllSessions(formattedParams);
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
    console.log("Add session clicked");
    navigate("/admin/sessions/create");
  };

  const handleEdit = (sessionId) => {
    navigate(`/admin/sessions/update/${sessionId}`);
  };

  const handleDelete = async (sessionId) => {
    try {
      await SessionService.deleteSession(sessionId);
      messageApi.success("Delete session successfully!");
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
    } catch (error) {
      console.error("Error deleting session:", error);
      messageApi.error("Failed to delete session. Please try again.");
    }
  };

  const handleView = (record) => {
    console.log("View session clicked:", record);
    setSelectedSession(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedSession(null);
  };

  const handleSearch = (values) => {
    console.log("Search values:", values);
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
        loading={loading}
      />

      <SessionTable
        dataSource={sessions}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          visible={isModalVisible}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AdminSession;
