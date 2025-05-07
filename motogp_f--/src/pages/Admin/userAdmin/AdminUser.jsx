import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, message, Spin, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import UserService from '../../../services/UserService.jsx';
import UserTable from "../../../components/admin/userAdmin/UserTable.jsx";
import UserDetailModal from "../../../components/admin/userAdmin/UserDetailModal.jsx";

const { Title } = Typography;

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const location = useLocation();

  // Hiển thị thông báo nếu có từ trang create/update
  useEffect(() => {
    if (location.state && location.state.successMessage) {
      messageApi.success(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: {} }); // Xóa state sau khi hiển thị
    }
  }, [location, messageApi, navigate]);

  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    try {

      const response = await UserService.getAllUsers();
      setUsers(response.data);
      setPagination(prev => ({ // Giả lập pagination ở client
        ...prev,
        total: response.data.length,
        current: params.current || 1 // Reset current page khi search/fetch lại
      }));

    } catch (err) {
      console.error("Failed to fetch users:", err);
      messageApi.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers({ current: pagination.current, pageSize: pagination.pageSize });
  }, [fetchUsers]); // Chỉ gọi fetchUsers khi nó thay đổi (ít khi) hoặc khi mount

  const handleTableChange = (newPagination, filters, sorter) => {
    // Cập nhật state pagination và gọi fetchUsers
    // Logic sort và filter có thể thêm ở đây nếu backend hỗ trợ
    fetchUsers({ current: newPagination.current, pageSize: newPagination.pageSize });
  };

  const handleSearch = (values) => {
    setSearchParams(values);
    // Reset về trang 1 khi thực hiện tìm kiếm mới
    fetchUsers({ current: 1, pageSize: pagination.pageSize, ...values });
  };

  const handleAdd = () => {
    navigate('/admin/users/create');
  };

  const handleEdit = (userId) => {
    navigate(`/admin/users/update/${userId}`);
  };

  const handleDelete = async (userId) => {
    try {
      await UserService.deleteUser(userId);
      messageApi.success('User deleted successfully!');
      fetchUsers({ current: pagination.current, pageSize: pagination.pageSize }); // Refresh list
    } catch (err) {
      console.error("Failed to delete user:", err);
      messageApi.error(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  return (
    <>
      {contextHolder}
      <div className={'flex justify-between items-center mb-4'}>
        <h2 className={'text-2xl font-medium'}>User management</h2>
        <Button
          type="primary"
          className={"bg-blue-700"}
          onClick={handleAdd}
          icon={<PlusOutlined/>}
        >
          Add User
        </Button>
      </div>
      <Spin spinning={loading} tip="Loading users...">
        <UserTable
          dataSource={users}
          loading={loading}
          pagination={pagination}
          onTableChange={handleTableChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </Spin>
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          visible={isModalVisible}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default AdminUser;