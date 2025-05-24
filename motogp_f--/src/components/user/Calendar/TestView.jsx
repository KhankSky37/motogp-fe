import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import dayjs from "dayjs";
import classNames from "classnames";
import { getImageUrl } from "../../../utils/urlHelpers.jsx";

// Thumbnails tạm thời
import randomImg01 from "../../../assets/00-barcelona-test.jpg";
import randomImg02 from "../../../assets/10BRNO.png";
import randomImg03 from "../../../assets/12 CAT 1.png";
import randomImg04 from "../../../assets/cze.png";
import randomImg05 from "../../../assets/fra2.png";
import randomImg06 from "../../../assets/FRA_DSC09720.jpg";
import randomImg07 from "../../../assets/jerez.jpg";
import randomImg08 from "../../../assets/mal1.png";
import randomImg09 from "../../../assets/mal2.jpg";
import randomImg10 from "../../../assets/rsm.jpg";
import randomImg11 from "../../../assets/THAI1.png";
import randomImg12 from "../../../assets/a-racing-track-with-twisting-traffic-blurred-background-bokeh-the-concept-of-racing-and-fast-driving-photo.jpg";
import randomImg13 from "../../../assets/race-car-motorcycle-racetrack-after-260nw-1737545399.webp";
import randomImg14 from "../../../assets/360_F_566610405_hZGYdfVSYHho4wxA6WP9EOSTU6ssBlVH.jpg";
import randomImg15 from "../../../assets/360_F_565254168_5RdItR4hEGAiVqtwU1IKuDwlwsblYjsn.jpg";

const imgs = [
  randomImg01, randomImg02, randomImg03, randomImg04, randomImg05,
  randomImg06, randomImg07, randomImg08, randomImg09, randomImg10,
  randomImg11, randomImg12, randomImg13, randomImg14, randomImg15,
];

const formatDate = (date) => dayjs(date).format("DD MMM").toUpperCase();

const TestView = ({ event, index, isUpNext }) => {
  const [isHovered, setIsHovered] = useState(false);
  if (event.eventType !== "TEST") return null;

  const now = new Date();
  const start = formatDate(event.startDate);
  const end = formatDate(event.endDate);

  let status = null;
  if (new Date(event.endDate) < now) status = "finished";
  else if (isUpNext) status = "upcoming";

  const statusText =
    status === "finished" ? "FINISHED" :
      status === "upcoming" ? "UP NEXT" : null;

  const countryCode = event.circuit?.locationCountry || "";
  const thumbnail = imgs[index % imgs.length];
  const officialImg = event?.circuit?.imageUrl
    ? getImageUrl(event.circuit.imageUrl)
    : null;

  const cardBgStyle = status === "upcoming"
    ? {
      backgroundImage: `url(${thumbnail})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
    }
    : {};

  return (
    <div
      className={classNames(
        "flex relative w-full rounded-xl overflow-hidden shadow-md transition-shadow cursor-pointer px-5 py-5",
        status === "upcoming" && "h-[584px]"
      )}
      style={{
        ...cardBgStyle,
        backgroundColor: status === "upcoming" ? undefined : "#ffffff",
        boxShadow: isHovered
          ? "0 0 1rem rgba(0,0,0,0.25)"
          : "0 2px 26px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {status === "upcoming" && (
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      )}

      {status === "upcoming" && officialImg && (
        <img
          src={officialImg}
          alt="official-circuit"
          className="absolute left-[-70px] bottom-[-60px] h-full w-1/2 object-cover pointer-events-none z-10"
        />
      )}

      {status && (
        <div
          className={classNames(
            "absolute top-0 right-0 px-4 py-2 text-white text-base font-semibold rounded-bl-md z-20",
            status === "finished" ? "bg-black" : "bg-red-600"
          )}
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 20% 100%, 0% 0%, 0 0)",
            width: "120px",
            textAlign: "center",
            whiteSpace: "nowrap",
            fontFamily: "'MGPText', sans-serif",
          }}
        >
          {statusText}
        </div>
      )}

      <div className="flex flex-col gap-1 w-full relative z-20">
        <div className="flex items-center gap-2">
          <ReactCountryFlag
            countryCode={countryCode}
            svg
            style={{
              width: "36px",
              height: "24px",
              filter: "contrast(1.2) saturate(1.3)",
            }}
            title={event.name}
          />
          <div
            className={classNames(
              "text-base font-light font-MGPDisplay tracking-wide",
              status === "upcoming" ? "text-[#C6C6C6]" : "text-[#606060]"
            )}
          >
            {start} - {end}
          </div>
        </div>

        <div
          className={classNames(
            "text-[40px] uppercase flex items-center gap-3 font-MGPDisplay",
            status === "upcoming" ? "text-white" : "text-black"
          )}
        >
          <span
            className={classNames(
              "font-light font-MGPDisplay",
              status === "upcoming" ? "text-[#C6C6C6]" : "text-[#606060]"
            )}
          >
            {index + 1}
          </span>
          <span className="font-extrabold tracking-wide">{event.name}</span>
        </div>

        <div
          className={classNames(
            "text-base font-light leading-snug font-MGPText",
            status === "upcoming" ? "text-[#C6C6C6]" : "text-[#606060]"
          )}
        >
          {event.officialName}
        </div>
      </div>

      {status !== "upcoming" && (
        <div className="absolute bottom-0 right-0 w-[400px] h-full overflow-hidden z-20">
          <img
            src={thumbnail}
            alt="circuit-thumbnail"
            className="w-full h-full object-cover"
            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
          />
          {officialImg && (
            <img
              src={officialImg}
              alt="official-circuit"
              className="absolute right-0 top-0 h-full w-1/2 object-cover pointer-events-none z-10"
            />
          )}
          <div className="absolute inset-y-0 right-0 w-2/3 bg-gradient-to-l from-black/90 to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
};

export default TestView;
