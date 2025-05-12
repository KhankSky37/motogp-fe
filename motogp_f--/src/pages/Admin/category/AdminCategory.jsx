import React, {useCallback, useEffect, useState} from 'react';
import {Button, message, Spin, Typography} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import CategoryService from '../../../services/CategoryService.jsx';
import CategoryTable from '../../../components/admin/category/CategoryTable.jsx';
import CategoryFormModal from '../../../components/admin/category/CategoryFormModal.jsx';
import CategoryDetailModal from '../../../components/admin/category/CategoryDetailModal.jsx';

const {Title} = Typography;

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // For edit and view
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [formModalLoading, setFormModalLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchCategories = useCallback(async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      // Backend doesn't support pagination, so we fetch all and paginate client-side
      const response = await CategoryService.getAllCategories();
      setCategories(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.length,
        current: page, // Ensure current page is updated
        pageSize: pageSize,
      }));
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      messageApi.error("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  }, [messageApi, pagination.current, pagination.pageSize]); // Include pagination states

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // fetchCategories will re-run if its dependencies change

  const handleTableChange = (newPagination) => {
    // Client-side pagination, so just update the state
    // fetchCategories will be called by useEffect if pagination.current or pageSize changes
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  const handleAdd = () => {
    setModalMode('add');
    setEditingCategory(null);
    setIsFormModalVisible(true);
  };

  const handleEdit = (category) => {
    setModalMode('edit');
    setEditingCategory(category);
    setIsFormModalVisible(true);
  };

  const handleView = (category) => {
    setEditingCategory(category);
    setIsDetailModalVisible(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      await CategoryService.deleteCategory(categoryId);
      messageApi.success('Category deleted successfully!');
      fetchCategories(pagination.current, pagination.pageSize); // Refresh list, stay on current page if possible
    } catch (err) {
      console.error("Failed to delete category:", err);
      messageApi.error(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  const handleFormSubmit = async (values) => {
    setFormModalLoading(true);
    try {
      if (modalMode === 'edit' && editingCategory) {
        await CategoryService.updateCategory(editingCategory.categoryId, values);
        messageApi.success('Category updated successfully!');
      } else {
        await CategoryService.createCategory(values);
        messageApi.success('Category created successfully!');
      }
      setIsFormModalVisible(false);
      setEditingCategory(null);
      fetchCategories(modalMode === 'add' ? 1 : pagination.current, pagination.pageSize); // Go to first page on add
    } catch (err) {
      console.error(`Failed to ${modalMode === 'edit' ? 'update' : 'create'} category:`, err);
      messageApi.error(err.response?.data?.message || `Failed to ${modalMode === 'edit' ? 'update' : 'create'} category.`);
    } finally {
      setFormModalLoading(false);
    }
  };

  const handleCloseFormModal = () => {
    setIsFormModalVisible(false);
    setEditingCategory(null);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setEditingCategory(null);
  };

  return (
    <>
      {contextHolder}
      <div className={'flex justify-between items-center mb-4'}>
        <Title level={3} style={{margin: 0}}>Manage Categories</Title>
        <Button
          type="primary"
          icon={<PlusOutlined/>}
          onClick={handleAdd}
        >
          Add Category
        </Button>
      </div>
      <Spin spinning={loading} tip="Loading categories...">
        <CategoryTable
          dataSource={categories}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={pagination}
          onTableChange={handleTableChange}
        />
      </Spin>
      {isFormModalVisible && (
        <CategoryFormModal
          visible={isFormModalVisible}
          onClose={handleCloseFormModal}
          onSubmit={handleFormSubmit}
          initialData={editingCategory}
          loading={formModalLoading}
          mode={modalMode}
        />
      )}
      {isDetailModalVisible && editingCategory && (
        <CategoryDetailModal
          category={editingCategory}
          visible={isDetailModalVisible}
          onClose={handleCloseDetailModal}
        />
      )}
    </>
  );
};

export default AdminCategory;