import React, {useState} from "react";
import ReactCountryFlag from "react-country-flag";
import dayjs from "dayjs";
import classNames from "classnames";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import {getImageUrl} from "../../../utils/urlHelpers.jsx";

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

const GPListCardUP = ({event, index, isUpNext}) => {
  const [isHovered, setIsHovered] = useState(false);

  const now = new Date();
  const start = formatDate(event.startDate);
  const end = formatDate(event.endDate);

  let status = null;
  if (new Date(event.endDate) < now) status = "finished";
  else if (isUpNext) status = "upcoming";

  const statusText =
    status === "finished" ? "FINISHED" :
      status === "upcoming" ? "UP NEXT" : null;

  const countryCode = getCountryCode(event.name);
  const thumbnail = imgs[index % imgs.length];

  const officialImg = event?.circuit?.imageUrl
    ? getImageUrl(event.circuit.imageUrl)
    : null;

  const cardBgStyle = status === "upcoming"
    ? {
      backgroundImage: `url(${thumbnail})`, // Ảnh thumbnail làm nền card khi upcoming
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
      color: "white",
    }
    : {};

  return (
    <div
      className={classNames(
        "flex relative w-full rounded-xl overflow-hidden shadow-md transition-shadow cursor-pointer px-5 py-5",
        status === "upcoming" && "h-[584px]"      // ⬅ cao 584 px cho UP NEXT
      )}
      style={{
        ...cardBgStyle,
        backgroundColor: status === "upcoming" ? undefined : "#ffffff",
        boxShadow: isHovered
          ? "0 0 1rem rgba(0,0,0,0.25)"
          : "0 2px 26px rgba(0,0,0,0.05)",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >

      {/* Overlay mờ khi background là ảnh thumbnail */}
      {status === "upcoming" && (
        <div className="absolute inset-0 bg-black/40 pointer-events-none"/>
      )}

      {/* Ảnh official circuit phủ lên toàn bộ card khi upcoming */}
      {status === "upcoming" && officialImg && (
        <img
          src={officialImg}
          alt="official-circuit"
          className="
      absolute left-[-70px] bottom-[-60px]          /* bám mép phải & trên */
      h-full w-1/2                    /* cao 100 %, rộng 50 % khối cha */
      object-cover                    /* giữ tỉ lệ, phủ kín khung của nó */
      pointer-events-none             /* ảnh không chặn hover/click */
      z-10
    "
        />
      )}

      {/* Tag trạng thái */}
      {status && (
        <div
          className={classNames(
            "absolute top-0 right-0 px-4 py-2 text-white text-xs font-semibold rounded-bl-md z-20",
            status === "finished" ? "bg-black" : "bg-red-600"
          )}
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 20% 100%, 0% 0%, 0 0)",
            width: "110px",
            textAlign: "center",
            whiteSpace: "nowrap",
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          {statusText}
        </div>
      )}

      {/* Nội dung trái */}
      <div className="flex flex-col gap-1 w-full relative z-20">
        {/* Flag + date */}
        <div className="flex items-center gap-2">
          <ReactCountryFlag
            countryCode={countryCode}
            svg
            style={{width: "36px", height: "24px", filter: "contrast(1.2) saturate(1.3)"}}
            title={event.name}
          />
          <div
            className={`text-base font-bold tracking-wide ${
              status === "upcoming" ? "text-gray-200" : "text-gray-500"
            }`}
          >
            {start} - {end}
          </div>
        </div>

        {/* Event name + STT */}
        <div
          className={classNames(
            "text-[40px] font-extrabold uppercase flex items-center gap-3",
            status === "upcoming" ? "text-white" : "text-black"
          )}
        >
          <span
            className={classNames(
              "font-bold",
              status === "upcoming" ? "text-gray-300" : "text-gray-500"
            )}
            style={{fontFamily: "'Orbitron', sans-serif"}}
          >
            {index + 1}
          </span>
          <span className="tracking-wide">{event.name}</span>
        </div>

        {/* Official name */}
        <div
          className={classNames(
            "text-base font-medium leading-snug",
            status === "upcoming" ? "text-gray-200" : "text-gray-400"
          )}
        >
          {event.officialName}
        </div>
      </div>

      {/* Ảnh nhỏ bên phải (thumbnail + officialImg) chỉ hiện khi không phải upcoming */}
      {status !== "upcoming" && (
        <div className="absolute bottom-0 right-0 w-[400px] h-full overflow-hidden z-20">
          {/* Ảnh thumbnail mặc định */}
          <img
            src={thumbnail}
            alt="circuit-thumbnail"
            className="w-full h-full object-cover"
            style={{boxShadow: "0 4px 12px rgba(0,0,0,0.15)"}}
          />

          {/* Ảnh official circuit phủ lên ảnh thumbnail */}
          {officialImg && (
            <img
              src={officialImg}
              alt="official-circuit"
              className="
      absolute right-0 top-0          /* bám mép phải & trên */
      h-full w-1/2                    /* cao 100 %, rộng 50 % khối cha */
      object-cover                    /* giữ tỉ lệ, phủ kín khung của nó */
      pointer-events-none             /* ảnh không chặn hover/click */
      z-10
    "
            />
          )}

          {/* Lớp đổ bóng mờ bên phải (gradient từ đen 80% sang trong suốt) */}
          <div
            className="
    absolute inset-y-0 right-0
    w-2/3                         /* rộng 2/3 khối cha */
    bg-gradient-to-l from-black/90 to-transparent   /* đậm hơn nhưng vẫn phai dần sang trong suốt */
    pointer-events-none
  "
          />


        </div>
      )}
    </div>
  );
};

export default GPListCardUP;
