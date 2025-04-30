// VideoSlider.jsx
import React from "react";
import { Carousel, Card } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "antd/dist/reset.css"; // nếu dùng antd v5 trở lên
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

const { Meta } = Card;

// 1. Dữ liệu mẫu
const videos = [
  {
    id: 1,
    thumb: "https://link-to-thumb1.jpg",
    duration: "00:01:00",
    title: "Ready to witness something special? Jerez awaits!",
    date: "21 APR 2025",
    margin: "5px 0",
  },
  // ... tiếp các video khác
];

// 2. Component Card cho mỗi video
const VideoCard = ({ video }) => (
  <Card
    hoverable
    cover={
      <div style={{ position: "relative" }}>
        <img
          src={video.thumb}
          alt={video.title}
          style={{ width: "100%", display: "block" }}
        />
        {/* badge thời lượng */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            background: "rgba(0,0,0,0.6)",
            color: "white",
            padding: "2px 6px",
            borderRadius: 4,
            fontSize: 12,
          }}
        >
          {video.duration}
        </div>
      </div>
    }
  >
    <Meta title={video.title} description={video.date} />
  </Card>
);

// 3. Cấu hình Carousel
const settings = {
  dots: false,
  infinite: false,
  speed: 400,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  nextArrow: <RightOutlined style={{ fontSize: 24, color: "#000" }} />,
  prevArrow: <LeftOutlined style={{ fontSize: 24, color: "#000" }} />,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 3 } },
    { breakpoint: 768, settings: { slidesToShow: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1 } },
  ],
};

export default function VideoSlider() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>LATEST VIDEOS</h2>
      <Carousel {...settings} className="">
        <div className="p-8 bg-slate-500 text-white">1</div>
        <div className="p-8 bg-green-700 text-white">1</div>

        <div className="p-8 bg-slate-500 text-white">1</div>
        <div className="p-8 bg-slate-500 text-white">1</div>
        <div className="p-8 bg-slate-500 text-white">1</div>
        <div className="p-8 bg-slate-500 text-white">1</div>
        <div className="p-8 bg-slate-500 text-white">1</div>
        <div className="p-8 bg-slate-500 text-white">1</div>
      </Carousel>
    </div>
  );
}
