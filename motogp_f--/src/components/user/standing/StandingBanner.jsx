import React from 'react';
import standingBg from "../../../assets/StandingBanner.webp";

const StandingBanner = ({type}) => {
  return (
    <div className="h-52 relative">
      <div className="absolute w-full h-full">
        <img
          src={standingBg}
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
      <div className="absolute lg:w-[50%] w-[75%] top-1/2 -translate-y-1/2">
        <div className="text-white text-5xl font-extrabold px-12 pb-4 font-MGPDisplay">
          {type === "rider"
            ? "CHAMPIONSHIP STANDINGS 2025"
            : type === "team"
            ? "TEAM STANDINGS 2025"
            : type === "constructor"
            ? "CONSTRUCTOR STANDINGS 2025"
            : type === "BMW"
            ? "BMW AWARD 2025"
            : ""}

        </div>
      </div>
    </div>
  );
};

export default StandingBanner;