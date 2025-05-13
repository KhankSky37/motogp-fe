// src/services/NewsService.jsx

import HttpClient from "../config/HttpClient.jsx";

const NewsService = {
    getAll(params = {}) {
        return HttpClient.get("/news", { params });
    },

    getById(id) {
        return HttpClient.get(`/news/${id}`);
    },

    create(newsData) {
        return HttpClient.post("/news", newsData);
    },

    update(id, newsData) {
        return HttpClient.put(`/news/${id}`, newsData);
    },

    delete(id) {
        return HttpClient.delete(`/news/${id}`);
    },
};

export default NewsService;
