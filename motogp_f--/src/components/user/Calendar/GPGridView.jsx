import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import dayjs from "dayjs";
import classNames from "classnames";

const formatDate = (date) => dayjs(date).format("DD MMM").toUpperCase();

const GPGridView = ({ event, index, isUpNext }) => {
  const [isHovered, setIsHovered] = useState(false);

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
    status === "finished" ? "FINISHED" : status === "upcoming" ? "UP NEXT" : null;

  const countryCode = event.circuit?.locationCountry || "";

  const textColor = status === "upcoming" ? "text-white" : "text-black";
  const subTextColor = status === "upcoming" ? "text-[#C6C6C6]" : "text-[#606060]";

  return (
    <div
      className="relative w-full rounded-xl p-3 overflow-hidden"
      style={{
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
      {/* Tag trạng thái */}
      {status && (
        <div
          className={classNames(
            "absolute font-MGPText top-0 right-0 px-4 py-1 text-white text-base font-medium rounded-bl-md",
            status === "finished" ? "bg-black" : "bg-red-600"
          )}
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 20% 100%, 0% 0%, 0 0)",
            width: "115px",
            textAlign: "end",
            whiteSpace: "nowrap",
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
        className={`text-sm font-MGPDisplay font-light tracking-wide mb-2 ${
          status === "upcoming" ? "text-[#C6C6C6]" : "text-[#606060]"
        }`}
      >
        {start} - {end}
      </div>

      {/* Tên quốc gia (tiêu đề) */}
      <div
        className={`text-lg font-MGPDisplay  font-light leading-none uppercase mb-1 ${
          status === "upcoming" ? "text-[#C6C6C6]" : "text-[#606060]"
        }`}
      >
          {index + 1}
        <span className={`font-bold ml-1 ${textColor}`}>
          {event.name}
        </span>
      </div>

      {/* Tên chính thức */}
      <div
        className={`text-sm font-MGPText leading-snug ${subTextColor}`}
      >
        {event.officialName}
      </div>
    </div>
  );
};

export default GPGridView;
