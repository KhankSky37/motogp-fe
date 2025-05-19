import React from "react";
import bgHome from "../../../assets/bg_results.png";

const EventBanner = ({ selectedEvent, fallbackName }) => {
  const eventName = selectedEvent?.officialName || fallbackName || "";
  const cityName = selectedEvent?.circuit?.locationCity || "";
  const eventDate = selectedEvent?.startDate || "";
  const countryCode = selectedEvent?.circuit?.countryCode?.toLowerCase() || "fra";

  return (
    <div className="h-52 relative">
      <div className="absolute w-full h-full">
        <img
          src={bgHome}
          className="h-full w-full object-cover object-[50%_75%]"
          alt="Result background"
        />
      </div>
      <div
        className="h-full w-full absolute"
        style={{
          background: "linear-gradient(90deg, #000 18.54%, transparent)",
        }}
      />
      <div className="absolute lg:w-[50%] w-[75%]">
        <div className="text-white text-4xl font-extrabold px-12 pb-4">
          {eventName}
        </div>
        {(cityName || eventDate) && (
          <div className="text-white flex px-12 pb-12 space-x-2">
            <img
              src={`https://photos.motogp.com/countries/flags/iso2/${countryCode}.svg`}
              alt={`${countryCode.toUpperCase()} flag`}
              className="w-6"
            />
            <div className="divide-x flex">
              {cityName && <div className="pr-2">{cityName}</div>}
              {eventDate && <div className="px-2">{eventDate}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventBanner;