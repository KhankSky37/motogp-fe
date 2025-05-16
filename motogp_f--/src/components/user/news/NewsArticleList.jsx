import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Spin, Pagination, Empty, message } from "antd";
import NewsArticleService from "../../../services/NewsArticleService.jsx";
import NewsArticleGrid from "./NewsArticleGrid.jsx";

const NewsArticleList = ({ articleType = "All News" }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });

  // Use useCallback to memoize the fetchArticles function
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
      };

      // Add article type filter if not "All News"
      if (articleType !== "All News") {
        params.articleType = articleType;
      }

      const response = await NewsArticleService.getAllNewsArticles(params);

      // Check if response data is valid
      if (response && response.data) {
        setArticles(response.data);

        // Get total count from headers or fallback to length
        const totalCount = response.headers?.["x-total-count"]
          ? parseInt(response.headers["x-total-count"])
          : response.data.length;

        setPagination((prev) => ({
          ...prev,
          total: totalCount,
        }));
      } else {
        setArticles([]);
        message.error("No data received from server");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      message.error("Failed to load news articles");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [articleType, pagination]); // Fixed: Use pagination object instead of its properties

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handlePageChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {articleType === "All News" ? "Latest News" : articleType}
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : articles.length > 0 ? (
        <>
          <NewsArticleGrid
            articles={articles}
            loading={false}
            articleType={articleType}
          />

          <div className="mt-8 flex justify-center">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["6", "12", "24", "48"]}
            />
          </div>
        </>
      ) : (
        <Empty
          description={`No ${articleType.toLowerCase()} articles found`}
          className="py-12"
        />
      )}
    </div>
  );
};

export default NewsArticleList;
