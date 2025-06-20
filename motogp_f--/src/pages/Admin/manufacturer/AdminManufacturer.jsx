import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, message, Space, Typography } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import ManufacturerService from "../../../services/ManufacturerService.jsx";
import ManufacturerTable from "../../../components/admin/manufacturer/ManufacturerTable.jsx";
import ManufacturerDetailModal from "../../../components/admin/manufacturer/ManufacturerDetailModal.jsx";
import ManufacturerSearchForm from "../../../components/admin/manufacturer/ManufacturerSearchForm.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const { Title } = Typography;

const AdminManufacturer = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra xem có trở về từ trang tạo mới hoặc cập nhật không
  useEffect(() => {
    // Nếu có state từ trang trước chuyển đến và có thông báo thành công
    if (location.state && location.state.success) {
      messageApi.success(
        location.state.message || "Operation completed successfully"
      );
      // Xóa state sau khi đã hiển thị thông báo
      navigate(location.pathname, { replace: true, state: {} });
      // Tự động refresh dữ liệu
      fetchManufacturers();
    }
  }, [location, messageApi, navigate]);

  const fetchManufacturers = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const mergedParams = {
          ...searchParams,
          ...params,
          page: params.current || pagination.current,
          size: params.pageSize || pagination.pageSize,
        };

        // Remove pagination params from the API call as they might be handled differently in the backend
        const apiParams = { ...mergedParams };
        delete apiParams.current;
        delete apiParams.pageSize;

        console.log("Fetching manufacturers with params:", apiParams); // Debug log
        const response = await ManufacturerService.getAllManufacturers(
          apiParams
        );

        if (response.status === 200) {
          console.log("Manufacturers fetched successfully:", response.data); // Debug log
          setManufacturers(response.data);

          // If the backend provides pagination info, update it
          // This assumes your API returns pagination metadata
          // Adjust according to your actual API response structure
          if (response.headers["x-total-count"]) {
            setPagination((prev) => ({
              ...prev,
              total: parseInt(response.headers["x-total-count"], 10),
            }));
          } else {
            // If no pagination info, estimate based on returned data
            setPagination((prev) => ({
              ...prev,
              total: response.data.length,
            }));
          }
        } else {
          throw new Error(
            `Failed to fetch manufacturers: ${response.statusText}`
          );
        }
      } catch (err) {
        console.error("Error fetching manufacturers:", err);
        setError("Failed to load manufacturer data. Please try again.");
        messageApi.error("Failed to load manufacturer data. Please try again.");
        setManufacturers([]);
      } finally {
        setLoading(false);
      }
    },
    [searchParams, pagination.current, pagination.pageSize, messageApi]
  );

  useEffect(() => {
    fetchManufacturers();
  }, [fetchManufacturers]);

  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      total: pagination.total,
    });

    // Handle sorting if needed
    const sortParams = {};
    if (sorter && sorter.field) {
      sortParams.sortField = sorter.field;
      sortParams.sortOrder = sorter.order === "ascend" ? "asc" : "desc";
    }

    fetchManufacturers({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      ...sortParams,
    });
  };

  const handleAdd = () => {
    navigate("/admin/manufacturers/create");
  };

  const handleEdit = (manufacturerId) => {
    navigate(`/admin/manufacturers/update/${manufacturerId}`);
  };

  const handleDelete = async (manufacturerId) => {
    try {
      console.log("Attempting to delete manufacturer with ID:", manufacturerId);

      const response = await ManufacturerService.deleteManufacturer(
        manufacturerId
      );

      console.log("Delete response:", response);

      // Success - show message and update UI
      messageApi.success("Manufacturer deleted successfully!");

      // Refresh the entire list to ensure we have the latest data
      fetchManufacturers(searchParams);
    } catch (error) {
      console.error("Error deleting manufacturer:", error);

      // Detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);

        if (error.response.status === 404) {
          messageApi.error(
            "Manufacturer not found. It may have been already deleted."
          );
        } else if (error.response.status === 500) {
          messageApi.error(
            "Server error while deleting. The manufacturer might be referenced by other records."
          );
        } else {
          messageApi.error(
            `Failed to delete manufacturer: ${
              error.response.data || error.message
            }`
          );
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        messageApi.error(
          "No response received from server. Please check your network connection."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        messageApi.error("Failed to delete manufacturer. Please try again.");
      }
    }
  };

  const handleView = (record) => {
    setSelectedManufacturer(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedManufacturer(null);
  };

  const handleSearch = (values) => {
    setSearchParams(values);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchManufacturers({ ...values, current: 1 });
  };

  const handleRefresh = () => {
    setSearchParams({});
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchManufacturers({ current: 1 });
    messageApi.info("Data refreshed");
  };

  return (
    <div className="manufacturer-management">
      {contextHolder}

        <div className="flex justify-between items-center mb-4">
          <Title level={3} className="m-0">
            Manufacturer Management
          </Title>
          <Space>
            <Button
              onClick={handleRefresh}
              icon={<ReloadOutlined />}
              loading={loading}
            >
              Refresh
            </Button>
            <Button type="primary" onClick={handleAdd} icon={<PlusOutlined />}>
              Add Manufacturer
            </Button>
          </Space>
        </div>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            className="mb-4"
            onClose={() => setError(null)}
          />
        )}

        <ManufacturerSearchForm onFinish={handleSearch} />

        <ManufacturerTable
          dataSource={manufacturers}
          loading={loading}
          pagination={pagination}
          onTableChange={handleTableChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ManufacturerDetailModal
          manufacturer={selectedManufacturer}
          visible={isModalVisible}
          onClose={handleModalClose}
        />
    </div>
  );
};

export default AdminManufacturer;
