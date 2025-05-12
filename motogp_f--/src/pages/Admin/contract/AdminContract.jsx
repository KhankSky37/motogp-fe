import React, {useCallback, useEffect, useState} from 'react';
import {Button, message, Spin, Typography} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import ContractService from '../../../services/ContractService.jsx';
import ContractTable from '../../../components/admin/contract/ContractTable.jsx';
import ContractFormModal from '../../../components/admin/contract/ContractFormModal.jsx';
import ContractDetailModal from '../../../components/admin/contract/ContractDetailModal.jsx';

const {Title} = Typography;

const AdminContract = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [formModalLoading, setFormModalLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchContracts = useCallback(async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const response = await ContractService.getAllContracts(); // Backend doesn't seem to support pagination for contracts
      setContracts(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.length, // Client-side pagination
        current: page,
        pageSize: pageSize,
      }));
    } catch (err) {
      console.error("Failed to fetch contracts:", err);
      messageApi.error("Failed to fetch contracts.");
    } finally {
      setLoading(false);
    }
  }, [messageApi, pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleTableChange = (newPagination) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
    // fetchContracts will be called by useEffect due to pagination state change
  };

  const handleAdd = () => {
    setModalMode('add');
    setEditingContract(null);
    setIsFormModalVisible(true);
  };

  const handleEdit = (contract) => {
    setModalMode('edit');
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
      messageApi.success('Contract deleted successfully!');
      fetchContracts(pagination.current, pagination.pageSize);
    } catch (err) {
      console.error("Failed to delete contract:", err);
      messageApi.error(err.response?.data?.message || 'Failed to delete contract.');
    }
  };

  const handleFormSubmit = async (values) => {
    setFormModalLoading(true);
    const contractDto = {...values};

    try {
      if (modalMode === 'edit' && editingContract) {
        // For update, ensure the ID from the form (if present and disabled) or from editingContract is used.
        // The backend expects the ID in the path, and the DTO might also contain it.
        // The DTO from the form will have all fields including the ID if it was set.
        await ContractService.updateContract(editingContract.id, contractDto);
        messageApi.success('Contract updated successfully!');
      } else {
        // For add, the DTO from the form contains the user-provided ID.
        await ContractService.createContract(contractDto);
        messageApi.success('Contract created successfully!');
      }
      setIsFormModalVisible(false);
      setEditingContract(null);
      fetchContracts(modalMode === 'add' ? 1 : pagination.current, pagination.pageSize);
    } catch (err) {
      console.error(`Failed to ${modalMode === 'edit' ? 'update' : 'create'} contract:`, err);
      messageApi.error(err.response?.data?.message || `Failed to ${modalMode === 'edit' ? 'update' : 'create'} contract.`);
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

  return (
    <>
      {contextHolder}
      <div className={'flex justify-between items-center mb-4'}>
        <Title level={3} style={{margin: 0}}>Contracts Management</Title>
        <Button
          type="primary"
          icon={<PlusOutlined/>}
          onClick={handleAdd}
        >
          Add Contract
        </Button>
      </div>
      <Spin spinning={loading} tip="Loading contracts...">
        <ContractTable
          dataSource={contracts}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={pagination}
          onTableChange={handleTableChange}
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