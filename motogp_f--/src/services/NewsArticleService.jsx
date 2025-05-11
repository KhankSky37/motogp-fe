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
    // HttpClient cần được cấu hình để gửi FormData mà không tự động set Content-Type
    // Hoặc bạn có thể set Content-Type: 'multipart/form-data' một cách tường minh nếu httpClient không tự xử lý
    return httpClient.post(API.NEWS, formData, {
      headers: {
        // Đặt Content-Type là undefined để Axios tự động đặt header đúng cho multipart/form-data
        // Điều này sẽ ghi đè bất kỳ Content-Type mặc định nào từ cấu hình global của httpClient
        'Content-Type': undefined,
      },
    });
  },

  updateNewsArticle: (id, newsArticleDto, photoFile) => { // Thêm photoFile
    const formData = new FormData();
    formData.append(
      "newsArticle",
      new Blob([JSON.stringify(newsArticleDto)], {type: "application/json"})
    );
    if (photoFile) { // Chỉ append nếu có file mới
      formData.append("photo", photoFile);
    }
    // Để Axios tự động đặt Content-Type cho FormData
    return httpClient.put(`${API.NEWS}/${id}`, formData, {
      headers: {
        'Content-Type': undefined, // Quan trọng để Axios xử lý multipart/form-data đúng cách
      },
    });
  },

  deleteNewsArticle: (id) => {
    return httpClient.delete(`${API.NEWS}/${id}`);
  },
};

export default NewsArticleService;
