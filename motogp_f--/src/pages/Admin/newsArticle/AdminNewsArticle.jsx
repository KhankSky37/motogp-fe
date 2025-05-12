import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, message, Spin, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import NewsArticleService from '../../../services/NewsArticleService.jsx';
import NewsArticleTable from "../../../components/admin/newsArticle/NewsArticleTable.jsx";
import NewsArticleSearchForm from "../../../components/admin/newsArticle/NewsArticleSearchForm.jsx";
import NewsArticleDetailModal from "../../../components/admin/newsArticle/NewsArticleDetailModal.jsx"; // Sẽ thêm sau

const { Title } = Typography;

const AdminNewsArticle = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10, // Số item mỗi trang cho client-side pagination
    total: 0,
  });
  const [searchParams, setSearchParams] = useState({}); // Sẽ chứa { keyword: "..." }
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const location = useLocation();

  // Hiển thị thông báo nếu có từ trang create/update
  useEffect(() => {
    if (location.state && location.state.successMessage) {
      messageApi.success(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, messageApi, navigate]);

  const fetchNewsArticles = useCallback(async (currentParams = {}) => {
    setLoading(true);
    const queryParams = { ...searchParams }; // Chỉ gửi keyword nếu có

    try {
      const response = await NewsArticleService.getAllNewsArticles(queryParams);
      setNewsArticles(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.length, // Tổng số item cho client-side pagination
        current: currentParams.current || 1, // Reset về trang 1 khi search hoặc giữ nguyên khi table change
        pageSize: currentParams.pageSize || prev.pageSize,
      }));
    } catch (err) {
      console.error("Failed to fetch news articles:", err);
      messageApi.error("Failed to fetch news articles.");
      setNewsArticles([]); // Đảm bảo articles là mảng rỗng khi lỗi
    } finally {
      setLoading(false);
    }
  }, [searchParams, messageApi]);

  useEffect(() => {
    fetchNewsArticles({ current: pagination.current, pageSize: pagination.pageSize });
  }, [fetchNewsArticles]);

  const handleTableChange = (newPagination) => {
    // Chỉ cập nhật state pagination cho client-side
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
    // Không cần gọi fetchNewsArticles ở đây vì backend không phân trang
  };

  const handleSearch = (values) => {
    setSearchParams(values);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleAdd = () => {
    navigate('/admin/news-articles/create'); // Cập nhật route nếu cần
  };

  const handleEdit = (articleId) => {
    navigate(`/admin/news-articles/update/${articleId}`); // Cập nhật route nếu cần
  };

  const handleDelete = async (articleId) => {
    try {
      await NewsArticleService.deleteNewsArticle(articleId);
      messageApi.success('News article deleted successfully!');
      // Fetch lại danh sách sau khi xóa
      fetchNewsArticles({ current: pagination.current, pageSize: pagination.pageSize });
    } catch (err) {
      console.error("Failed to delete news article:", err);
      messageApi.error(err.response?.data?.message || 'Failed to delete news article.');
    }
  };

  const handleView = (article) => {
    setSelectedArticle(article);
    setIsModalVisible(true);
    // console.log("View article:", article); // Tạm thời log ra
    // Mở modal chi tiết (sẽ làm sau)
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedArticle(null);
  };

  return (
    <>
      {contextHolder}
      <div className={'flex justify-between items-center mb-4'}>
        <Title level={3} style={{ margin: 0 }}>News Articles Management</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className={"bg-blue-700"}
          onClick={handleAdd}
        >
          Add News Article
        </Button>
      </div>
      <NewsArticleSearchForm onSearch={handleSearch} loading={loading} />
      <Spin spinning={loading} tip="Loading news articles...">
        <NewsArticleTable
          dataSource={newsArticles}
          loading={loading}
          pagination={pagination}
          onTableChange={handleTableChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </Spin>
      {selectedArticle && (
        <NewsArticleDetailModal
          article={selectedArticle}
          visible={isModalVisible}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default AdminNewsArticle;