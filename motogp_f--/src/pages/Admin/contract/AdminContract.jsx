import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Button, message, Spin} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import ContractService from "../../../services/ContractService.jsx";
import ContractTable from "../../../components/admin/contract/ContractTable.jsx";
import ContractFormModal from "../../../components/admin/contract/ContractFormModal.jsx";
import ContractDetailModal from "../../../components/admin/contract/ContractDetailModal.jsx";
import RiderService from "../../../services/RiderService.jsx";
import TeamService from "../../../services/TeamService.jsx";
import SeasonService from "../../../services/SeasonService.jsx";
import CategoryService from "../../../services/CategoryService.jsx";
import ContractSearchForm from "../../../components/admin/contract/ContractSearchForm.jsx";

const AdminContract = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [formModalLoading, setFormModalLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [teamsList, setTeamsList] = useState([]);
  const [ridersList, setRidersList] = useState([]);
  const [seasonsList, setSeasonsList] = useState([]); // Thêm state cho seasons
  const [categoriesList, setCategoriesList] = useState([]); // Thêm state cho categories
  const [searchParams, setSearchParams] = useState({}); // State cho search params

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [teamsRes, ridersRes, seasonsRes, categoriesRes] =
        await Promise.all([
          TeamService.getAllTeams(),
          RiderService.getAllRiders(),
          SeasonService.getAllSeasons(), // Fetch seasons
          CategoryService.getAllCategories(), // Fetch categories
        ]);

      setTeamsList(teamsRes.data?.content || teamsRes.data || []);
      setRidersList(ridersRes.data?.content || ridersRes.data || []);
      setSeasonsList(seasonsRes.data || []); // Giả sử seasonsRes.data là một mảng
      setCategoriesList(categoriesRes.data || []); // Giả sử categoriesRes.data là một mảng
    } catch (err) {
      console.error("Failed to fetch data:", err);
      messageApi.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const teamsMap = useMemo(() => {
    return teamsList.reduce((acc, team) => {
      acc[team.id] = team.name;
      return acc;
    }, {});
  }, [teamsList]);

  const ridersMap = useMemo(() => {
    return ridersList.reduce((acc, rider) => {
      acc[rider.riderId] = `${rider.firstName} ${rider.lastName}`;
      return acc;
    }, {});
  }, [ridersList]);

  const fetchContracts = useCallback(
    async (page = pagination.current, pageSize = pagination.pageSize) => {
      setLoading(true);
      const queryParams = {...searchParams};

      try {
        const response = await ContractService.getAllContracts(queryParams);
        setContracts(response.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data.length,
          current: page,
          pageSize: pageSize,
        }));
      } catch (err) {
        console.error("Failed to fetch contracts:", err);
        messageApi.error("Failed to fetch contracts.");
      } finally {
        setLoading(false);
      }
    },
    [searchParams, pagination.current, pagination.pageSize]
  );

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleTableChange = (newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  const handleAdd = () => {
    setModalMode("add");
    setEditingContract(null);
    setIsFormModalVisible(true);
  };

  const handleEdit = (contract) => {
    setModalMode("edit");
    setEditingContract(contract);
    setIsFormModalVisible(true);
  };

  const handleView = (contract) => {
    setEditingContract(contract);
    setIsDetailModalVisible(true);
  };

  const handleDelete = async (contractId) => {
    try {
      await ContractService.deleteContract(contractId);
      messageApi.success("Contract deleted successfully!");
      fetchContracts(pagination.current, pagination.pageSize);
    } catch (err) {
      console.error("Failed to delete contract:", err);
      messageApi.error(
        err.response?.data?.message || "Failed to delete contract."
      );
    }
  };
  const handleFormSubmit = async (values) => {
    setFormModalLoading(true);
    let contractDto = {...values};

    try {
      if (modalMode === "edit" && editingContract) {
        // Preserve createdDate and createUser from the original contract
        contractDto = {
          ...contractDto,
          createdDate: editingContract.createdDate,
          createUser: editingContract.createUser,
        };
        await ContractService.updateContract(editingContract.id, contractDto);
        messageApi.success("Contract updated successfully!");
      } else {
        // For add, the DTO from the form contains the user-provided ID.
        await ContractService.createContract(contractDto);
        messageApi.success("Contract created successfully!");
      }
      setIsFormModalVisible(false);
      setEditingContract(null);
      fetchContracts(
        modalMode === "add" ? 1 : pagination.current,
        pagination.pageSize
      );
    } catch (err) {
      console.error(
        `Failed to ${modalMode === "edit" ? "update" : "create"} contract:`,
        err
      );
      messageApi.error(
        err.response?.data?.message ||
        `Failed to ${modalMode === "edit" ? "update" : "create"} contract.`
      );
    } finally {
      setFormModalLoading(false);
    }
  };

  const handleCloseFormModal = () => {
    setIsFormModalVisible(false);
    setEditingContract(null);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setEditingContract(null);
  };

  const handleSearch = (values) => {
    console.log("helo search", values);
    setSearchParams(values);
    setPagination((prev) => ({...prev, current: 1})); // Reset về trang 1 khi tìm kiếm
  };

  return (
    <>
      {contextHolder}{" "}
      <div className={"flex justify-between items-center mb-4"}>
        <h2 className={"text-2xl font-medium"}>Contracts Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined/>}
          onClick={handleAdd}
          className={"bg-blue-700"}
        >
          Add Contract
        </Button>
      </div>
      <ContractSearchForm
        onSearch={handleSearch}
        loading={loading} // Sử dụng loading chung khi form đang tìm kiếm
        teamsData={teamsList}
        ridersData={ridersList}
        seasonsData={seasonsList}
        categoriesData={categoriesList}
      />
      <Spin spinning={loading} tip="Loading contracts...">
        <ContractTable
          dataSource={contracts}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={pagination}
          onTableChange={handleTableChange}
          teamsMap={teamsMap}
          ridersMap={ridersMap}
        />
      </Spin>
      {isFormModalVisible && (
        <ContractFormModal
          visible={isFormModalVisible}
          onClose={handleCloseFormModal}
          onSubmit={handleFormSubmit}
          initialData={editingContract}
          loading={formModalLoading}
          mode={modalMode}
          teamsData={teamsList}
          ridersData={ridersList}
          seasonsData={seasonsList}
          categoriesData={categoriesList}
          dataLoading={loading} // Sử dụng loading chung của parent cho các Select trong modal
        />
      )}
      {isDetailModalVisible && editingContract && (
        <ContractDetailModal
          contract={editingContract}
          visible={isDetailModalVisible}
          onClose={handleCloseDetailModal}
        />
      )}
    </>
  );
};

export default AdminContract;
