// NewsSectionStatic.jsx
import React from "react";
import { Card, Typography } from "antd";
import Slider from "react-slick";
import CustomArrow from "./CustomArrow.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Ảnh import sẵn
import video01 from "../../../assets/DSC05777-2.webp";
import video02 from "../../../assets/DSC07041.webp";
import video03 from "../../../assets/Last5-QP-UK.webp";
import video04 from "../../../assets/LG9_9554.webp";
import video05 from "../../../assets/MGP-FP2-UK.webp";
import video06 from "../../../assets/MGP-Q1-UK.webp";
import video07 from "../../../assets/MGP-Q2-UK.webp";
import video08 from "../../../assets/DSC00947.webp";
import video09 from "../../../assets/VE511.050.webp";
import video010 from "../../../assets/vlcsnap-2025-05-24-14h13m33s702-copy.webp";

const { Title } = Typography;

const staticArticles = [
  { id: 1, title: "Three turns trouble Marc Marquez after eventful Friday", image: video01 },
  { id: 2, title: "OnBoard: Ride with Quartararo as he completes pole hat-trick", image: video02 },
  { id: 3, title: "On one lap we are starting to be really, really fast - Q2 reaction", image: video03 },
  { id: 4, title: "LAST 5 MINS: Quartararo demolishes the competition in Q2 thiller", image: video04 },
  { id: 5, title: "MotoGP™ Q1: Tissot Grand Prix of the United Kingdom", image: video05 },
  {
    id: 6,
    title: "MotoGP™ FP2: Tissot Grand Prix of the United Kingdom - Get the stopwatches out as the premier class grid showcase their race pace at Silverstone ahead of qualifying 24 May 2025",
    image: video06
  },
  { id: 7, title: "HIGHLIGHTS: Alex Marquez sets new lap record at Silverstone's Day 1", image: video07 },
  { id: 8, title: "Three turns trouble Marc Marquez after eventful Friday", image: video08 },
  { id: 9, title: "MotoGP™ FP1: Tissot Grand Prix of the United Kingdom", image: video09 },
  { id: 10, title: "MotoGP™ FP1: Tissot Grand Prix of the United Kingdom", image: video010 },
];

const NewsSectionStatic = ({ showOverflow = false }) => {
  const slidesToShow = 4;

  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow,
    slidesToScroll: 3,
    nextArrow: (
      <CustomArrow
        type="next"
        currentSlide={0}
        slideCount={staticArticles.length}
        slidesToShow={slidesToShow}
      />
    ),
    prevArrow: (
      <CustomArrow
        type="prev"
        currentSlide={0}
        slideCount={staticArticles.length}
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
    className: showOverflow ? "show-overflow" : "hide-overflow",
  };

  return (
    <div className="relative group px-4 md:px-8 lg:px-12 py-6 overflow-hidden">
      <Title level={2} className="font-MGPDisplay !text-2xl md:!text-3xl text-white mb-4">
        Latest Videos
      </Title>
      <Slider {...settings}>
        {staticArticles.map((article) => (
          <div key={article.id} className="">
            <div className="group relative transition-transform duration-300 ease-in-out hover:scale-[1.1] hover:z-10">
              <Card
                hoverable
                className="rounded-md overflow-hidden shadow-md transition-all duration-300 bg-[#181C21]"
                bodyStyle={{ padding: "12px" }}
                style={{
                  width: "100%",
                  maxWidth: "350px",
                  height: "300px",
                  margin: "0 auto",
                }}
                cover={
                  <div
                    className="w-full"
                    style={{
                      height: "200px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      alt="news"
                      src={article.image}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute bottom-[33%] z-10 left-0 flex items-center gap-2 text-sm font-bold font-MGPText text-white px-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      00:34:21
                    </div>
                    <div
                      className="absolute bottom-[33%] left-0 w-[100px] h-7 bg-black opacity-60 z-0"
                      style={{
                        clipPath: "polygon(0 0, 90% 10%, 100% 100%, 0% 100%)",
                      }}
                    ></div>
                  </div>
                }
              >
                <Card.Meta
                  title={
                    <span className="font-MGPText font-bold text-base md:text-lg text-white">
                      {article.title}
                    </span>
                  }
                />
                <div className="absolute bottom-0 left-0 text-colorText px-4 py-2 text-xs uppercase">
                  23 May 2025
                </div>
              </Card>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewsSectionStatic;
