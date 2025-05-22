// NewsSection.jsx
import React, { useEffect, useState } from "react";
import { Card, Typography, Spin } from "antd";
import Slider from "react-slick";
import NewsArticleService from "../../../../services/NewsArticleService.jsx";
import CustomArrow from "../CustomArrow.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./news-section.css";
import { getImageUrl } from "../../../../utils/urlHelpers.jsx";

const { Title, Paragraph } = Typography;

const NewsSection = ({ showOverflow = false }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // ✅ Sửa đúng hàm gọi API theo NewsArticleService
    NewsArticleService.getAllNewsArticles()
      .then((response) => setArticles(response.data))
      .catch((error) => console.error("Error fetching news articles:", error))
      .finally(() => setLoading(false));
  }, []);

  const slidesToShow = 4;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
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
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
    centerMode: false,
    centerPadding: "0px",
    cssEase: "linear",
    slidesSpacing: 0,
    className: showOverflow ? "show-overflow" : "hide-overflow",
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="relative group px-12 py-4 overflow-hidden">
      <Title level={2} className={"font-MGPDisplay"}>Latest News</Title>
      <div className="px-0 mx-0">
        <Slider {...settings}>
          {articles.map((article) => (
            <div key={article.id} className="pl-0 pr-1">
              <div className="group relative transition-transform duration-300 ease-in-out hover:scale-[1.2] hover:z-10">
                <Card
                  hoverable
                  className="rounded-md overflow-hidden shadow-md transition-all duration-300"
                  style={{ width: "400px" }}
                  cover={
                    <div
                      style={{
                        height: "200px",
                        width: "400px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        alt="news"
                        src={getImageUrl(article.imageUrl)}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  }
                  onClick={() => window.open(article.articleLink, "_blank")}
                >
                  <Card.Meta title={<span className={"font-MGPDisplay"}>{article.title}</span>} />
                  <Paragraph className="mt-2 text-xs font-MGPText">
                    {new Date(article.publishDate).toLocaleDateString()}
                  </Paragraph>
                </Card>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default NewsSection;
