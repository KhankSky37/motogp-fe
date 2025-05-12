import httpClient from "../config/HttpClient.jsx";
import {API} from "../constants/Endpoints.jsx";

const NewsArticleService = {
  getAllNewsArticles: (params) => {
    return httpClient.get(API.NEWS, {params});
  },

  getNewsArticleById: (id) => {
    return httpClient.get(`${API.NEWS}/${id}`);
  },

  createNewsArticle: (newsArticleDto, photoFile) => {
    const formData = new FormData();
    formData.append(
      "newsArticle",
      new Blob([JSON.stringify(newsArticleDto)], {type: "application/json"})
    );
    if (photoFile) {
      formData.append("photo", photoFile);
    }
    return httpClient.post(API.NEWS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateNewsArticle: (id, newsArticleDto, photoFile = null) => { // Thêm photoFile
    const formData = new FormData();
    formData.append(
      "newsArticle",
      new Blob([JSON.stringify(newsArticleDto)], {type: "application/json"})
    );
    if (photoFile) { // Chỉ append nếu có file mới
      formData.append("photo", photoFile);
    }
    return httpClient.put(`${API.NEWS}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteNewsArticle: (id) => {
    return httpClient.delete(`${API.NEWS}/${id}`);
  },
};

export default NewsArticleService;
