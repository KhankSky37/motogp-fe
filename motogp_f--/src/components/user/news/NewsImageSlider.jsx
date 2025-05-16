import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import NewsArticleService from "../../../services/NewsArticleService.jsx";
import { getImageUrl } from "../../../utils/urlHelpers.jsx";
import { Card, Typography, Spin } from "antd";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { Paragraph } = Typography;

const NewsImageSlider = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    NewsArticleService.getAllNewsArticles()
      .then((res) => setArticles(res.data))
      .finally(() => setLoading(false));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  if (loading) return <Spin size="large" />;

  return (
    <div className="w-full">
      <Slider {...settings}>
        {articles.map((article) => (
          <div key={article.id} className="px-2">
            <Card
              hoverable
              cover={
                <img
                  alt={article.title}
                  src={getImageUrl(article.imageUrl)}
                  className="h-48 w-full object-cover rounded-t-md"
                />
              }
              className="rounded-md overflow-hidden shadow-md"
              onClick={() => window.open(article.articleLink, "_blank")}
            >
              <div className="font-bold text-base mb-1 truncate">{article.title}</div>
              <Paragraph className="text-xs mb-0">
                {new Date(article.publishDate).toLocaleDateString()}
              </Paragraph>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewsImageSlider;
