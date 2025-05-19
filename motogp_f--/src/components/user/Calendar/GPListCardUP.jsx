import React, {useState} from "react";
import ReactCountryFlag from "react-country-flag";
import dayjs from "dayjs";
import classNames from "classnames";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);
const formatDate = (date) => dayjs(date).format("DD MMM").toUpperCase();
const getCountryCode = (name) => countries.getAlpha2Code(name, "en") || "";

const GPListCardUP = ({event, index, isUpNext}) => {
  const [isHovered, setIsHovered] = useState(false);

  const now = new Date();
  const start = formatDate(event.startDate);
  const end = formatDate(event.endDate);

  let status = null;
  if (new Date(event.endDate) < now) {
    status = "finished";
  } else if (isUpNext) {
    status = "upcoming";
  }

  const statusText = status === "finished" ? "FINISHED" : status === "upcoming" ? "UP NEXT" : null;

  const countryCode = getCountryCode(event.name);

  return (
    <div
      className="flex relative w-full rounded-xl overflow-hidden shadow-md transition-shadow cursor-pointer px-[20px] py-5"
      style={{
        backgroundColor: status === "upcoming" ? "#262626" : "#ffffff",
        boxShadow: isHovered ? "0 0 1rem rgba(0,0,0,0.25)" : "0 2px 26px rgba(0,0,0,0.05)",
        fontFamily: "'Montserrat', sans-serif",
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

      {/* Nội dung chính (tương tự GPListCardResults) */}
      <div className="flex flex-col gap-1 w-full relative">
        {/* Flag + date */}
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
            className={`text-base font-bold tracking-wide ${
              status === "upcoming" ? "text-gray-300" : "text-gray-500"
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
          <div className="flex items-center gap-3">
    <span
      className={classNames(
        "font-bold text-gray-500",
        status === "upcoming" ? "text-gray-400" : "text-gray-500"
      )}
      style={{fontFamily: "'Orbitron', sans-serif"}}
    >
      {index + 1}
    </span>
            <span className="tracking-wide">{event.name}</span>
          </div>
        </div>


        {/* Official name */}
        <div
          className={classNames(
            "text-base font-medium leading-snug",
            status === "upcoming" ? "text-gray-300" : "text-gray-400"
          )}
        >
          {event.officialName}
        </div>
      </div>
    </div>
  );
};

export default GPListCardUP;

