import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import dayjs from "dayjs";
import classNames from "classnames";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { getImageUrl } from "../../../utils/urlHelpers.jsx";

// Import ảnh thumbnail giả
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

const imgs = [
  randomImg01, randomImg02, randomImg03, randomImg04, randomImg05,
  randomImg06, randomImg07, randomImg08, randomImg09, randomImg10,
  randomImg11, randomImg12, randomImg13, randomImg14, randomImg15,
];

countries.registerLocale(enLocale);
const formatDate = (date) => dayjs(date).format("DD MMM").toUpperCase();
const getCountryCode = (name) => countries.getAlpha2Code(name, "en") || "";

const GPListViewUP = ({ event, index, isUpNext }) => {
  const [isHovered, setIsHovered] = useState(false);

  const now = new Date();
  const start = formatDate(event.startDate);
  const end = formatDate(event.endDate);

  const isFinished = new Date(event.endDate) < now;
  const status = isFinished ? "finished" : isUpNext ? "upcoming" : null;
  const statusText = status === "finished" ? "FINISHED" : status === "upcoming" ? "UP NEXT" : null;

  const countryCode = getCountryCode(event.name);
  const thumbnail = imgs[index % imgs.length];
  const officialImg = event?.circuit?.imageUrl ? getImageUrl(event.circuit.imageUrl) : null;

  const isUpcoming = status === "upcoming";

  return (
    <div
      className={classNames(
        "flex relative w-full rounded-xl overflow-hidden shadow-md transition-shadow cursor-pointer px-5 py-5",
        isUpcoming && "h-[584px]"
      )}
      style={{
        backgroundImage: isUpcoming ? `url(${thumbnail})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: isUpcoming ? undefined : "#ffffff",
        position: isUpcoming ? "relative" : undefined,
        boxShadow: isHovered ? "0 0 1rem rgba(0,0,0,0.25)" : "0 2px 26px rgba(0,0,0,0.05)",
      }}
    >
      {isUpcoming && <div className="absolute inset-0 bg-black/40 pointer-events-none" />}
      {isUpcoming && officialImg && (
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
              isUpcoming ? "text-[#C6C6C6]" : "text-[#606060]"
            )}
          >
            {start} - {end}
          </div>
        </div>

        <div
          className={classNames(
            "text-[40px] uppercase flex items-center gap-3 font-MGPDisplay",
            isUpcoming ? "text-white" : "text-black"
          )}
        >
          <span
            className={classNames(
              "font-light",
              isUpcoming ? "text-[#C6C6C6]" : "text-[#606060]"
            )}
          >
            {index + 1}
          </span>
          <span className="font-extrabold tracking-wide">{event.name}</span>
        </div>

        <div
          className={classNames(
            "text-base font-light leading-snug font-MGPText",
            isUpcoming ? "text-[#C6C6C6]" : "text-[#606060]"
          )}
        >
          {event.officialName}
        </div>
      </div>

      {!isUpcoming && (
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

export default GPListViewUP;
