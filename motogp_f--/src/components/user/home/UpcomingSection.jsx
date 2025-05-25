import React from "react";
import Slider from "react-slick";
import { useEvents } from "../../../hooks/useEvents.jsx";
import CustomArrow from "./CustomArrow";
import { getImageUrl } from "../../../utils/urlHelpers.jsx";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import randomImg01 from "../../../assets/08 Aragon.png";
import randomImg02 from "../../../assets/09 Italia.png";
import randomImg03 from "../../../assets/10 Assen.png";
import randomImg04 from "../../../assets/11 Sachsenring.png";
import randomImg05 from "../../../assets/12 CZE.png";
import randomImg06 from "../../../assets/13 Austria.png";
import randomImg07 from "../../../assets/14 Hungary.png";
import randomImg08 from "../../../assets/15 Catalunya.png";
import randomImg09 from "../../../assets/16 San Marino.png";
import randomImg10 from "../../../assets/17 Japan.png";
import randomImg11 from "../../../assets/18 Indonesia.png";
import randomImg12 from "../../../assets/19 australia.png";
import randomImg13 from "../../../assets/20malasya.png";
import randomImg14 from "../../../assets/21 Portugal.png";
import randomImg15 from "../../../assets/22 valencia.png";

const bgImages = [
  randomImg01, randomImg02, randomImg03, randomImg04, randomImg05,
  randomImg06, randomImg07, randomImg08, randomImg09, randomImg10,
  randomImg11, randomImg12, randomImg13, randomImg14, randomImg15
];

const getFlagUrl = (countryCode) => {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
};

const formatEventDate = (startDateStr, endDateStr) => {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  const startDay = start.getDate();
  const endDay = end.getDate();

  const startMonth = start.toLocaleString("en-US", { month: "long" }).toUpperCase();
  const endMonth = end.toLocaleString("en-US", { month: "long" }).toUpperCase();

  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startMonth === endMonth && startYear === endYear) {
    return `${startDay} – ${endDay} ${startMonth} ${startYear}`;
  }

  if (startYear === endYear) {
    return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${startYear}`;
  }

  return `${startDay} ${startMonth} ${startYear} – ${endDay} ${endMonth} ${endYear}`;
};

const UpcomingSection = () => {
  const { events, loading } = useEvents();
  const slidesToShow = 3;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: slidesToShow,
    arrows: true,
    nextArrow: (
      <CustomArrow type="next" slideCount={events.length} slidesToShow={slidesToShow} />
    ),
    prevArrow: (
      <CustomArrow type="prev" slideCount={events.length} slidesToShow={slidesToShow} />
    ),
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  if (loading) return <p>Đang tải sự kiện...</p>;

  const today = new Date();
  const raceEvents = events
    .filter((event) => event.eventType === "RACE" && new Date(event.startDate) > today)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  if (!raceEvents.length) return <p>Không có sự kiện đua nào</p>;

  return (
    <div className="relative px-12 py-6 overflow-hidden group">
      <h1 className="font-bold text-black font-MGPDisplay text-2xl mb-4">
        Upcoming Events
      </h1>
      <Slider {...settings}>
        {raceEvents.map((event, idx) => {
          const bgImage = bgImages[idx % bgImages.length];
          const countryCode = event.circuit?.locationCountry || "";
          const flagUrl = countryCode ? getFlagUrl(countryCode) : null;

          return (
            <div key={event.id} className="px-0.5"> {/* khoảng cách giữa các slide */}
              <div className="h-[230px] overflow-hidden relative">
                <div
                  className="bg-cover bg-center border shadow-md w-full h-full text-white flex flex-col justify-end p-4 overflow-hidden"
                  style={{ backgroundImage: `url(${bgImage})` }}
                >
                  <div className="absolute inset-0 bg-black/40 z-0" />
                  <div className="absolute top-0 left-0 p-4 flex items-start gap-2 z-10 flex-col">
                    <div className="font-MGPText font-medium bg-red-600 px-2 py-1 rounded-lg">MotoGP</div>
                    <h2 className="text-2xl font-MGPDisplay font-bold">{event.name}</h2>
                  </div>

                  <div className="absolute right-0 -top-[25%] w-[60%] p-4 z-10">
                    {event.circuit?.imageUrl && (
                      <img
                        src={getImageUrl(event.circuit.imageUrl)}
                        alt={event.circuit.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 font-medium font-MGPText text-sm p-4 z-2 flex items-center gap-2">
                    {flagUrl && (
                      <img
                        src={flagUrl}
                        alt={countryCode}
                        className="w-7 h-5 object-cover"
                      />
                    )}
                    <div>{formatEventDate(event.startDate, event.endDate)}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default UpcomingSection;
