import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomArrow from "./CustomArrow";

import Riders01 from "../../../assets/93-m-marquez-profile-card.webp";
import Riders02 from "../../../assets/Web-Riders_AMarquez.webp";
import Riders03 from "../../../assets/01-bagnaia-profile-card.webp";
// import Riders04 from "../../../assets/Web-Riders_Morbidelli.webp";
import Riders05 from "../../../assets/Web-Riders_Di_Giannantonio.webp";
import Riders06 from "../../../assets/20-quartarato-profile-card.webp";
import Riders07 from "../../../assets/mgp-card-riders-profile-31-PAacp.webp";
import Riders08 from "../../../assets/89-martin-profile-card.webp";
// import Riders09 from "../../../assets/Web-Riders_Zarco.webp";
import Riders010 from "../../../assets/Web-Riders_Aldeguer.webp";
import Riders011 from "../../../assets/ai-ogura.webp";
import Riders012 from "../../../assets/Web-Riders_Vin-ales.webp";
import Riders013 from "../../../assets/72-bezzecchi-profile-card.webp";

const shirtImages = [
  Riders01, Riders02, Riders03,
  Riders05, Riders06, Riders07,
  Riders08, Riders010, Riders011,
  Riders012, Riders013,
];

const riders = [
  {id: "mm93", image: Riders01},
  {id: "AM73", image: Riders02},
  {id: "FB63", image: Riders03},
  // { id: "21", image: Riders04 },
  {id: "FD49", image: Riders05},
  {id: "FQ20", image: Riders06},
  {id: "PA37", image: Riders07},
  {id: "JM1", image: Riders08},
  // { id: "5",  image: Riders09 },
  {id: "FA54", image: Riders010},
  {id: "AO79", image: Riders011},
  {id: "MV12", image: Riders012},
  {id: "MV12", image: Riders013},
];


const RidersSection = () => {
  const slidesToShow = 5;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 4,
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
      {breakpoint: 1280, settings: {slidesToShow: 4, slidesToScroll: 4}},
      {breakpoint: 1024, settings: {slidesToShow: 3, slidesToScroll: 3}},
      {breakpoint: 768, settings: {slidesToShow: 2, slidesToScroll: 2}},
      {breakpoint: 480, settings: {slidesToShow: 1, slidesToScroll: 1}},
    ],
  };

  return (
    <div className="relative px-12 py-6 overflow-hidden group">
      <h1 className="font-bold text-black font-MGPDisplay text-2xl mb-4">MotoGP™ Riders</h1>
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

export default RidersSection;
