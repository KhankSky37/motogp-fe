import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ResultService from "../../../services/ResultService.jsx";
import ResultTable from "../../../components/admin/result/ResultTable.jsx";
import ResultDetailModal from "../../../components/admin/result/ResultDetailModal.jsx";
import ResultSearchForm from "../../../components/admin/result/ResultSearchForm.jsx";
import { useNavigate } from "react-router-dom";

const AdminResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams, setSearchParams] = useState({});

  const navigate = useNavigate();

  const fetchResults = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ResultService.getAllResults(params);
      setResults(response.data);
    } catch (err) {
      console.error("Error fetching results:", err);
      setError("Failed to load result data. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(searchParams);
  }, [fetchResults, searchParams]);

  const handleTableChange = (newPagination) => {
    const { current, pageSize } = newPagination;
    setPagination((prev) => ({
      ...prev,
      current: current,
      pageSize: pageSize,
    }));
  };

  const handleAdd = () => {
    navigate("/admin/results/create");
  };

  const handleEdit = (resultId) => {
    navigate(`/admin/results/update/${resultId}`);
  };

  const handleDelete = async (resultId) => {
    try {
      await ResultService.deleteResult(resultId);
      messageApi.success("Result deleted successfully!");
      fetchResults(searchParams); // Refresh the list
    } catch (error) {
      console.error("Error deleting result:", error);

      if (error.response) {
        if (error.response.status === 404) {
          messageApi.error(
            "Result not found. It may have been already deleted."
          );
        } else if (error.response.status === 409) {
          messageApi.error(
            "This result cannot be deleted because it is referenced by other data."
          );
        } else {
          messageApi.error(
            `Failed to delete result: ${
              error.response.data?.message || "Unknown error"
            }`
          );
        }
      } else {
        messageApi.error(
          "Failed to delete result. Please check your network connection."
        );
      }
    }
  };

  const handleView = (record) => {
    setSelectedResult(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedResult(null);
  };

  const handleSearch = (values) => {
    setSearchParams(values);
    setPagination((prev) => ({ ...prev, current: 1 }));
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
        <h2 className={"text-2xl font-medium"}>Result Management</h2>
        <Button
          type="primary"
          className={"bg-blue-700"}
          onClick={handleAdd}
          icon={<PlusOutlined />}
        >
          Add Result
        </Button>
      </div>

      <ResultSearchForm onFinish={handleSearch} />

      <ResultTable
        results={results}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ResultDetailModal
        visible={isModalVisible}
        onClose={handleModalClose}
        result={selectedResult}
      />
    </div>
  );
};

export default AdminResult;
