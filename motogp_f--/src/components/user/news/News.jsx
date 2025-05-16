import React, { useState, useEffect } from "react";
import { Spin, Divider, Typography, Skeleton, BackTop } from "antd";
import { UpOutlined } from "@ant-design/icons";
import NewsArticleService from "../../../services/NewsArticleService.jsx";
import FeaturedNews from "./FeaturedNews.jsx";
import NewsArticleList from "./NewsArticleList.jsx";
import UserLayout from "../../../layouts/UserLayout.jsx";

const { Title } = Typography;

const News = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroArticle, setHeroArticle] = useState(null);

  useEffect(() => {
    // Get the latest news articles for featured section
    NewsArticleService.getAllNewsArticles()
      .then((response) => {
        // Sort by publish date (newest first) - improve date handling with proper comparison
        const sortedArticles = [...response.data].sort((a, b) => {
          const dateA = new Date(a.publishDate);
          const dateB = new Date(b.publishDate);

          // Handle invalid dates by putting them at the end
          if (isNaN(dateA)) return 1;
          if (isNaN(dateB)) return -1;

          return dateB - dateA;
        });

        // Select the first article as hero article
        if (sortedArticles.length > 0) {
          setHeroArticle(sortedArticles[0]);
          // Take the next 4 articles for featured section
          setFeaturedArticles(sortedArticles.slice(1, 5));
        }
      })
      .catch((error) => {
        console.error("Error fetching featured news articles:", error);
        // Set empty state to avoid broken UI
        setFeaturedArticles([]);
        setHeroArticle(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserLayout>
      <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Title level={1} className="text-center text-white mb-4">
            MotoGP™ News
          </Title>
          <p className="text-center text-lg text-blue-200 max-w-2xl mx-auto">
            Stay updated with the latest news, race reports, and official
            announcements from the world of MotoGP
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-12">
            <Skeleton active paragraph={{ rows: 1 }} className="mb-6" />
            <Skeleton.Image className="w-full h-96 mb-6" />
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        ) : (
          <>
            <div className="py-8 md:py-12">
              <FeaturedNews
                heroArticle={heroArticle}
                featuredArticles={featuredArticles}
              />
            </div>

            <Divider className="my-6" />

            <div className="py-8 md:py-12">
              <NewsArticleList />
            </div>
          </>
        )}
      </div>

      <BackTop>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <UpOutlined />
        </div>
      </BackTop>
    </UserLayout>
  );
};

export default News;
