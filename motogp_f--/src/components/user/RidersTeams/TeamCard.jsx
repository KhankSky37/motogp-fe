import React from "react";
import { Typography } from "antd";
import { getImageUrl } from "../../../utils/urlHelpers";

const { Title } = Typography;

const TeamCard = ({ team, bgColor = "gray" }) => {
  const { name, logoPath, riders = [] } = team;
  const upperName = name?.toUpperCase();

  return (
    <div className="relative rounded-lg overflow-hidden shadow-md w-full h-[420px] bg-black text-white font-sans flex flex-col justify-end">
      {/* Gradient đen phía dưới */}
      <div
        className="absolute bottom-0 left-0 w-full z-8 pointer-events-none"
        style={{
          height: "30%",
          background: "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.1))",
        }}
      />

      <div className="relative flex-grow overflow-hidden">
        {/* Màu nền team */}
        <div
          className="absolute inset-0 rounded-lg z-1 transition-colors duration-500 ease-in-out"
          style={{
            background: bgColor,
            opacity: 0.8,
          }}
        />
        <div className="absolute inset-0 z-3 bg-black opacity-20 rounded-lg pointer-events-none" />
        <div className="absolute inset-0 z-4 rounded-lg pointer-events-none bg-[linear-gradient(300deg,transparent,#171c21_98%)]" />
        <div className="absolute inset-0 z-7 rounded-lg pointer-events-none bg-[linear-gradient(180deg,rgba(23,28,33,0),#171c21)]" />
        <div
          className="absolute inset-0 z-7 pointer-events-none"
          style={{
            background: "linear-gradient(to top right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 40%)",
          }}
        />

        <div className="absolute font-MGPDisplay font-bold text-[160px] whitespace-nowrap top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  z-0 text-colorText italic">
          {upperName}
        </div>

        {/* Ảnh logo/xe */}
        <div className="absolute -bottom-1/2 left-1/2 w-full -translate-x-1/2 z-6">
          <img
            src={getImageUrl(logoPath)}
            alt={name}
            className="mx-auto max-h-[70%] object-contain"
          />
        </div>

        {/* Tên đội & tay đua */}
        <div className="absolute p-4 left-0 bottom-0 z-10">
          <Title
            level={4}
            className="!m-0 !text-2xl uppercase !font-bold font-MGPDisplay"
            style={{
              color: "#fff",
              WebkitTextStroke: "0.5px #000",
            }}
          >
            {upperName}
          </Title>
          <div className="mt-2 flex flex-col text-sm text-colorText font-MGPText font-light">
            {riders.map((rider) => (
              <span key={rider.id} className="capitalize">
                {rider.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
