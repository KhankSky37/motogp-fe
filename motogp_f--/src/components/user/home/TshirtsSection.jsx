import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomArrow from "./CustomArrow";

import T_shirts01 from "../../../assets/Widget_608x912px.webp";
import T_shirts02 from "../../../assets/Widget_608x912px_1.webp";
import T_shirts03 from "../../../assets/Widget_608x912px_2.webp";
import T_shirts04 from "../../../assets/Widget_608x912px_4.webp";
import T_shirts05 from "../../../assets/Widget_608x912px_3.webp";
import T_shirts06 from "../../../assets/Widget_608x912px_6.webp";
import T_shirts07 from "../../../assets/Widget_608x912px_7.webp";
import T_shirts08 from "../../../assets/Widget_608x912px_8.webp";
import T_shirts09 from "../../../assets/Purple-Graphic-t-shirt.webp";

const shirtImages = [
  T_shirts01, T_shirts02, T_shirts03,
  T_shirts04, T_shirts05, T_shirts06,
  T_shirts07, T_shirts08, T_shirts09
];

const TshirtsSection = () => {
  const slidesToShow = 5;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToShow,
    arrows: true,
    nextArrow: (
      <CustomArrow
        type="next"
        slideCount={shirtImages.length}
        slidesToShow={slidesToShow}
      />
    ),
    prevArrow: (
      <CustomArrow
        type="prev"
        slideCount={shirtImages.length}
        slidesToShow={slidesToShow}
      />
    ),
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4, slidesToScroll: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="relative px-12 py-6 overflow-hidden group">
      <h1 className="font-bold text-black font-MGPDisplay text-2xl mb-4">Best Sellers</h1>
      <Slider {...settings}>
        {shirtImages.map((src, idx) => (
          <div key={idx} className="px-1">
            <div className="overflow-hidden shadow-md transition-transform duration-300 ease-in-out hover:scale-105">
              <img
                src={src}
                alt={`shirt-${idx}`}
                className="w-full h-[400px] object-cover object-center"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TshirtsSection;
