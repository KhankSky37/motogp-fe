import React, { useState, useEffect } from "react";
import {Typography, Skeleton, Empty, Row, Col, ConfigProvider, Tabs} from "antd"; // Thêm Row và Col từ Antd
import { useNavigate } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import NewsArticleService from "../../../services/NewsArticleService.jsx";
import NewsArticleGrid from "../../../components/user/news/NewsArticleGrid.jsx";
import { getStandardArticleType } from "../../../utils/formatters.jsx";
import headerImg from "../../../assets/_DS_8660.webp";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomArrow from "../../../components/user/home/CustomArrow.jsx";
import ResultsHeader from "../../../components/user/result/ResultsHeader.jsx";

const { Title } = Typography;

const NewsPage = () => {
  const [loading, setLoading] = useState(true);
  const [groupedArticles, setGroupedArticles] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await NewsArticleService.getAllNewsArticles();
        const data = response.data || [];
        const groups = {};
        data.forEach((article) => {
          const type =
            getStandardArticleType(article.articleType) ||
            article.articleType ||
            "Other";
          if (!groups[type]) groups[type] = [];
          groups[type].push(article);
        });
        setGroupedArticles(groups);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setGroupedArticles({});
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const items=[
    {
      key: "NEWS",
      label: <span className="font-medium text-lg font-MGPText">NEWS</span>,
    },
    {
      key:"gp-report",
      label: <span className="font-medium text-lg font-MGPText">GP REPORTS</span>,
    },
    {
      key:"offical",
      label: <span className="font-medium text-lg font-MGPText">OFFICAL COMMUNICATIONS</span>,
    }
  ]
  return (
    <>
      <ResultsHeader title={"news"}/>
      <div className={"px-12 relative bg-[#c80502]"}>
        <div className="absolute inset-0 bg-black opacity-85"></div>
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-l to-black from-transparent"></div>
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                itemColor: "#ffffff",
                itemSelectedColor: "#ffffff",
                itemHoverColor: "#ffffff",
                inkBarColor: "#ffffff",
              },
            },
          }}
        >
          <Tabs items={items} rootClassName={"relative"}/>
        </ConfigProvider>
      </div>
      <div className="relative w-full h-[400px] flex items-end overflow-hidden">
        <img
          src={headerImg}
          alt="MotoGP News Header"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />
        <div className="relative z-20 p-10 pb-14 max-w-2xl flex items-end">
          <div className="flex-1">
            <div className="text-white/80 text-sm mb-2 font-MGPText">MotoGP™ News</div>
            <h1
              className="font-MGPDisplay text-4xl font-extrabold uppercase text-white leading-tight drop-shadow-lg mb-6"
            >
              ESPARGARO SET FOR SECOND HRC WILDCARD AT SILVERSTONE
            </h1>
            <button className="font-MGPText bg-red-600 hover:bg-red-700 text-white font-bold rounded-full px-6 py-2 text-base shadow-lg transition-all">
              READ NOW
            </button>
          </div>
        </div>
      </div>
      <div className="px-12 py-8">
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : Object.keys(groupedArticles).length === 0 ? (
          <Empty description="No news articles found" className="py-12" />
        ) : (
          Object.keys(groupedArticles)
            .filter((type) => type !== "All News")
            .map((type) => (
              <div key={type} className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <Title
                    level={3}
                    className="font-MGPDisplay pl-2 border-l-4 border-blue-600 mb-0 text-xl font-semibold"
                  >
                    {type}
                  </Title>
                  <button
                    className="flex items-center text-sm font-bold uppercase text-black hover:text-red-600 transition-colors duration-300 group font-MGPDisplay"
                    onClick={() =>
                      navigate(`/news?type=${encodeURIComponent(type)}`)
                    }
                  >
                    VIEW MORE
                    <RightOutlined className="ml-1.5 text-red-500 text-base transform transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
                {/* Slider cho từng loại tin tức */}
                <Slider
                  dots={false}
                  infinite={false}
                  speed={500}
                  slidesToShow={4}
                  slidesToScroll={4}
                  nextArrow={
                    <CustomArrow
                      type="next"
                      currentSlide={0} // sẽ được slider tự động cập nhật
                      slideCount={groupedArticles[type].length}
                      slidesToShow={4}
                    />
                  }
                  prevArrow={
                    <CustomArrow
                      type="prev"
                      currentSlide={0}
                      slideCount={groupedArticles[type].length}
                      slidesToShow={4}
                    />
                  }
                  responsive={[
                    {
                      breakpoint: 1024,
                      settings: { slidesToShow: 3, slidesToScroll: 3 },
                    },
                    {
                      breakpoint: 768,
                      settings: { slidesToShow: 2, slidesToScroll: 2 },
                    },
                    {
                      breakpoint: 480,
                      settings: { slidesToShow: 1, slidesToScroll: 1 },
                    },
                  ]}
                >
                  {groupedArticles[type].map((article) => (
                    <div key={article.id} className="px-2">
                      <NewsArticleGrid
                        articles={[article]}
                        loading={false}
                        articleType={type}
                        isCardOnly
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            ))
        )}
        <div className="flex flex-col justify-center mt-16 bg-[#171c21] p-6 text-center items-center">
          <div className={"text-4xl text-white font-extrabold text-center mb-4 font-MGPDisplay"}>Get the official MotoGP™ Newsletter!
          </div>
          <div className={'text-white text-center mb-8 font-MGPText'}>Create a MotoGP™ account now and gain access to exclusive
            content, such as the MotoGP™ Newsletter, which
            features GP Reports, incredible videos and other interesting information about our sport.
          </div>
          <div className={"bg-white w-40 text-center px-5 py-3 rounded-3xl font-semibold"}>SIGN UP FOR FREE</div>
        </div>
      </div>

    </>
  );
};

export default NewsPage;
