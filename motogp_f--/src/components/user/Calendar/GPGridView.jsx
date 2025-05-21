import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import dayjs from "dayjs";
import classNames from "classnames";

// Hàm format ngày
const formatDate = (date) => dayjs(date).format("DD MMM").toUpperCase();

const GPGridView = ({ event, index, isUpNext }) => {
  const [isHovered, setIsHovered] = useState(false);

  // 👉 Chỉ hiển thị nếu là sự kiện RACE
  if (event.eventType !== "RACE") return null;

  const now = new Date();
  const start = formatDate(event.startDate);
  const end = formatDate(event.endDate);

  let status = null;
  if (new Date(event.endDate) < now) {
    status = "finished";
  } else if (isUpNext) {
    status = "upcoming";
  }

  const statusText =
    status === "finished"
      ? "FINISHED"
      : status === "upcoming"
        ? "UP NEXT"
        : null;

  const countryCode = event.circuit?.locationCountry || "";

  const textColor = status === "upcoming" ? "text-white" : "text-black";
  const subTextColor = status === "upcoming" ? "text-gray-300" : "text-gray-400";

  return (
    <div
      className="relative w-full rounded-xl p-3 overflow-hidden"
      style={{
        fontFamily: "'Montserrat', 'Orbitron', sans-serif",
        boxShadow: isHovered
          ? "0 0 1rem 0 rgba(0, 0, 0, .25)"
          : "0 2px 26px 0 rgba(0, 0, 0, 0.05)",
        backgroundColor: status === "upcoming" ? "#262626" : "#ffffff",
        transition: "box-shadow 0.3s ease",
        cursor: "pointer",
        height: "100%",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Góc phải: Tag trạng thái */}
      {status && (
        <div
          className={classNames(
            "absolute top-0 right-0 px-4 py-2 text-white text-xs font-semibold rounded-bl-md",
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

      {/* Cờ quốc gia */}
      <div className="flex items-center gap-2 mb-2">
        <ReactCountryFlag
          countryCode={countryCode}
          svg
          style={{
            width: "23px",
            height: "16px",
            filter: "contrast(1.2) saturate(1.3)",
          }}
          title={countryCode}
        />
      </div>

      {/* Ngày tháng */}
      <div
        className={`text-sm font-semibold tracking-wide mb-2 ${
          status === "upcoming" ? "text-gray-300" : "text-gray-500"
        }`}
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {start} - {end}
      </div>

      {/* STT + tên quốc gia */}
      <div
        className={`text-xl font-extrabold uppercase mb-2 ${textColor}`}
        style={{ fontFamily: "'Orbitron', sans-serif" }}
      >
        {index + 1} <span className="tracking-wide">{event.name}</span>
      </div>

      {/* Tên chính thức */}
      <div
        className={`text-sm font-medium leading-snug ${subTextColor}`}
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {event.officialName}
      </div>
    </div>
  );
};

export default GPGridView;
``
