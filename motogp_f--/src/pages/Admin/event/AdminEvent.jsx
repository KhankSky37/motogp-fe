import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import EventService from "../../../services/EventService.jsx";
import SeasonService from "../../../services/SeasonService.jsx";
import CircuitService from "../../../services/CircuitService.jsx";
import { useNavigate } from "react-router-dom";
import EventTable from "../../../components/admin/event/EventTable.jsx";
import EventDetailModal from "../../../components/admin/event/EventDetailModal.jsx";
import EventSearchForm from "../../../components/admin/event/EventSearchForm.jsx";

const AdminEvent = () => {
  const [events, setEvents] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams, setSearchParams] = useState({});

  const navigate = useNavigate();

  // Fetch dropdown data for search form
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setFormLoading(true);
        const [seasonsResponse, circuitsResponse] = await Promise.all([
          SeasonService.getAllSeasons(),
          CircuitService.getAllCircuits(),
        ]);
        setSeasons(seasonsResponse.data);
        setCircuits(circuitsResponse.data);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        messageApi.error(
          "Failed to load filter data. Some search features may be limited."
        );
      } finally {
        setFormLoading(false);
      }
    };

    fetchFormData();
  }, [messageApi]);

  const fetchEvents = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await EventService.getAllEvents(params);
      setEvents(response.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load event data. Please try again.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(searchParams);
  }, [fetchEvents, searchParams]);

  const handleTableChange = (newPagination) => {
    const { current, pageSize } = newPagination;
    setPagination((prev) => ({
      ...prev,
      current: current,
      pageSize: pageSize,
    }));
  };

  const handleAdd = () => {
    navigate("/admin/events/create");
  };

  const handleEdit = (eventId) => {
    navigate(`/admin/events/update/${eventId}`);
  };

  const handleDelete = async (eventId) => {
    try {
      await EventService.deleteEvent(eventId);
      messageApi.success("Event deleted successfully!");
      fetchEvents(searchParams); // Refresh the list
    } catch (error) {
      console.error("Error deleting event:", error);

      // More specific error messages for delete operation
      if (error.response) {
        if (error.response.status === 404) {
          messageApi.error(
            "Event not found. It may have been already deleted."
          );
        } else if (error.response.status === 409) {
          messageApi.error(
            "This event cannot be deleted because it is referenced by other data."
          );
        } else {
          messageApi.error(
            `Failed to delete event: ${
              error.response.data?.message || "Unknown error"
            }`
          );
        }
      } else {
        messageApi.error(
          "Failed to delete event. Please check your network connection."
        );
      }
    }
  };

  const handleView = (record) => {
    setSelectedEvent(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
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
        <h2 className={"text-2xl font-medium"}>Event Management</h2>
        <Button
          type="primary"
          className={"bg-blue-700"}
          onClick={handleAdd}
          icon={<PlusOutlined />}
        >
          Add Event
        </Button>
      </div>

      <EventSearchForm
        onSearch={handleSearch}
        seasons={seasons}
        circuits={circuits}
        loading={formLoading}
      />

      <EventTable
        events={events}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EventDetailModal
        visible={isModalVisible}
        onCancel={handleModalClose}
        event={selectedEvent}
        viewOnly={true}
      />
    </div>
  );
};

export default AdminEvent;
