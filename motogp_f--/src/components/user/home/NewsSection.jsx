// NewsSection.jsx
import React, { useEffect, useState } from "react";
import { Card, Typography, Spin } from "antd";
import Slider from "react-slick";
import NewsArticleService from "../../../services/NewsArticleService.jsx";
import CustomArrow from "./CustomArrow.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getImageUrl } from "../../../utils/urlHelpers.jsx";

const { Title, Paragraph } = Typography;

const NewsSection = ({ showOverflow = false }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    NewsArticleService.getAllNewsArticles()
      .then((response) => setArticles(response.data))
      .catch((error) => console.error("Error fetching news articles:", error))
      .finally(() => setLoading(false));
  }, []);

  const slidesToShow = 4;

  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToShow,
    beforeChange: (_, next) => setCurrentSlide(next),
    nextArrow: (
      <CustomArrow
        type="next"
        currentSlide={currentSlide}
        slideCount={articles.length}
        slidesToShow={slidesToShow}
      />
    ),
    prevArrow: (
      <CustomArrow
        type="prev"
        currentSlide={currentSlide}
        slideCount={articles.length}
        slidesToShow={slidesToShow}
      />
    ),
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
    className: showOverflow ? "show-overflow" : "hide-overflow",
  };

  if (loading) return <Spin size="large" />;

  return (
    <div className="relative group px-4 md:px-12 py-4">
      <Title level={2} className="font-MGPDisplay !font-bold !text-2xl">Latest News</Title>
      <Slider {...settings}>
        {articles.map((article) => (
          <div key={article.id} className="">
            <div className="group relative transition-transform duration-300 ease-in-out hover:scale-[1.1] hover:z-10">
              <Card
                hoverable
                className="rounded-md overflow-hidden shadow-md transition-all duration-300 w-full max-w-[350px] mx-auto"
                cover={
                  <div className="h-[200px] w-full overflow-hidden">
                    <img
                      alt={article.title}
                      src={getImageUrl(article.imageUrl)}
                      onError={(e) => (e.target.style.display = "none")}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                }
                onClick={() => window.open(article.articleLink, "_blank")}
              >
                <Card.Meta
                  title={<span className="font-MGPDisplay">{article.title}</span>}
                />
                <Paragraph className="mt-2 text-xs font-MGPText">
                  {new Date(article.publishDate).toLocaleDateString()}
                </Paragraph>
              </Card>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewsSection;
