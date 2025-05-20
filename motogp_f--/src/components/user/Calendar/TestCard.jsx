import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import dayjs from "dayjs";
import classNames from "classnames";
import { getImageUrl } from "../../../utils/urlHelpers.jsx";

// Danh sách ảnh thumbnail tạm thời (có thể import từ asset như GPListCardUP)
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
import randomImg12 from "../../../assets/19 australia.png";
import randomImg13 from "../../../assets/20malasya.png";
import randomImg14 from "../../../assets/21 Portugal.png";
import randomImg15 from "../../../assets/22 valencia.png";

const imgs = [
  randomImg01, randomImg02, randomImg03, randomImg04, randomImg05,
  randomImg06, randomImg07, randomImg08, randomImg09, randomImg10,
  randomImg11, randomImg12, randomImg13, randomImg14, randomImg15,
];

const formatDate = (date) => dayjs(date).format("DD MMM").toUpperCase();

const TestCard = ({ event, index, isUpNext }) => {
  const [isHovered, setIsHovered] = useState(false);

  // 👉 Chỉ hiển thị nếu là TEST event
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
      color: "white",
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
        fontFamily: "'Montserrat', sans-serif",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Overlay mờ khi upcoming */}
      {status === "upcoming" && (
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      )}

      {status === "upcoming" && (
        <div
          className="
      absolute top-0 right-0 px-4 py-2 text-white text-xs font-semibold rounded-bl-md z-30
      bg-red-600
    "
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 20% 100%, 0% 0%, 0 0)",
            width: "110px",
            textAlign: "center",
            whiteSpace: "nowrap",
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          UP NEXT
        </div>
      )}

      {/* Ảnh official circuit phủ lên toàn bộ card khi upcoming */}
      {status === "upcoming" && officialImg && (
        <img
          src={officialImg}
          alt="official-circuit"
          className="
            absolute left-[-70px] bottom-[-60px]
            h-full w-1/2 object-cover pointer-events-none z-10
          "
        />
      )}

      {/* Nội dung trái */}
      <div className="flex flex-col gap-1 w-full relative z-20">
        {/* Flag + Date */}
        <div className="flex items-center gap-2">
          <ReactCountryFlag
            countryCode={countryCode}
            svg
            style={{
              width: "36px",
              height: "24px",
              filter: "contrast(1.2) saturate(1.3)",
            }}
            title={countryCode}
          />
          <div
            className={`text-base font-bold tracking-wide ${
              status === "upcoming" ? "text-gray-200" : "text-gray-500"
            }`}
          >
            {start} - {end}
          </div>
        </div>

        {/* STT + Event Name */}
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
            style={{ fontFamily: "'Orbitron', sans-serif" }}
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

      {/* Ảnh thumbnail + overlay khi không phải upcoming */}
      {status !== "upcoming" && (
        <div className="absolute bottom-0 right-0 w-[400px] h-full z-20">
          <div>
            {/* Ảnh thumbnail */}
            <img
              src={thumbnail}
              alt="circuit-thumbnail"
              className="w-full h-full object-cover"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            />

            {/* Tag trạng thái */}
            {status && (
              <div
                className={classNames(
                  "absolute top-0 left-[-110px] px-4 py-2 text-white text-xs font-semibold rounded-bl-md z-30",
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
          </div>

          {/* Ảnh official circuit nếu có */}
          {officialImg && (
            <img
              src={officialImg}
              alt="official-circuit"
              className="
                absolute right-0 top-0
                h-full w-1/2 object-cover pointer-events-none z-10
              "
            />
          )}

          {/* Lớp gradient mờ bên phải */}
          <div
            className="
              absolute inset-y-0 right-0
              w-2/3 bg-gradient-to-l from-black/90 to-transparent
              pointer-events-none
            "
          />
        </div>
      )}
    </div>
  );
};

export default TestCard;
