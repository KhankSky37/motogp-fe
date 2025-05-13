// NewsSection.jsx
import React, { useEffect, useState } from "react";
import { Card, Typography, Spin } from "antd";
import Slider from "react-slick";
import NewsArticleService from "../../../../services/NewsArticleService.jsx"; // ✅ sửa lại import đúng service
import CustomArrow from "../CustomArrow.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./news-section.css";
import {getImageUrl} from "../../../../utils/urlHelpers.jsx";

const { Title, Paragraph } = Typography;

const NewsSection = () => {
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
    };

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <div className="relative group px-6 py-4 overflow-hidden">
            <Title level={2}>Latest News</Title>
            <Slider {...settings}>
                {articles.map((article) => (
                    <div key={article.id} className="px-2">
                        <div className="group relative transition-transform duration-300 ease-in-out hover:scale-[1.2] hover:z-10">
                            <Card
                                hoverable
                                className="rounded-md overflow-hidden shadow-md transition-all duration-300"
                                cover={<img alt="news" src={getImageUrl(article.imageUrl)} />}
                                onClick={() => window.open(article.articleLink, "_blank")}
                            >
                                <Card.Meta title={article.title} />
                                <Paragraph className="mt-2 text-xs">
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
