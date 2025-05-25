import { useEffect, useState } from "react";
import NewsArticleService from "../services/NewsArticleService";

// ✅ Lấy danh sách tất cả bài viết
export const useNewsList = (params = {}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await NewsArticleService.getAllNewsArticles(params);
        setArticles(res.data);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [JSON.stringify(params)]);

  return { articles, loading };
};

// ✅ Lấy bài viết theo ID
export const useNewsById = (id) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        const res = await NewsArticleService.getNewsArticleById(id);
        setArticle(res.data);
      } catch (err) {
        console.error("Failed to fetch article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  return { article, loading };
};
