import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CircuitService from "../../../services/CircuitService.jsx";
import CircuitTable from "../../../components/admin/circuit/CircuitTable.jsx";
import CircuitDetailModal from "../../../components/admin/circuit/CircuitDetailModal.jsx";
import CircuitSearchForm from "../../../components/admin/circuit/CircuitSearchForm.jsx";
import { useNavigate } from "react-router-dom";
import { COUNTRIES } from "../../../constants/Countries.jsx";

const AdminCircuit = () => {
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCircuit, setSelectedCircuit] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const fetchCircuits = useCallback(async (keyword = "", country = null) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        keyword: keyword,
        country: country,
      };

      console.log("Search params:", params);

      const response = await CircuitService.getAllCircuits(params);
      console.log("Search response:", response.data);
      setCircuits(response.data);
    } catch (err) {
      console.error("Error fetching circuits:", err);
      setError("Failed to load circuit data. Please try again.");
      setCircuits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCircuits();
  }, [fetchCircuits]);

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
    navigate("/admin/circuits/create");
  };

  const handleEdit = (circuitId) => {
    navigate(`/admin/circuits/update/${circuitId}`);
  };

  const handleDelete = async (circuitId) => {
    try {
      await CircuitService.deleteCircuit(circuitId);
      messageApi.success("Circuit deleted successfully!");
      setCircuits((prev) => prev.filter((circuit) => circuit.id !== circuitId));
    } catch (error) {
      console.error("Error deleting circuit:", error);
      messageApi.error("Failed to delete circuit. Please try again.");
    }
  };

  const handleView = (record) => {
    setSelectedCircuit(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedCircuit(null);
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
    // Chỉ lấy country nếu là code hợp lệ trong COUNTRIES hoặc nếu có values.country
    const country = values.country || null;
    fetchCircuits(values.keyword, country);
  };

  return (
    <div>
      {contextHolder}
      <div className={"flex justify-between items-center mb-4"}>
        <h2 className={"text-2xl font-medium"}>Circuit Management</h2>
        <Button
          type="primary"
          className={"bg-blue-700"}
          onClick={handleAdd}
          icon={<PlusOutlined />}
        >
          Add Circuit
        </Button>
      </div>
      <CircuitSearchForm onFinish={onSearchFinish} />

      <CircuitTable
        dataSource={circuits}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CircuitDetailModal
        circuit={selectedCircuit}
        visible={isModalVisible}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default AdminCircuit;
