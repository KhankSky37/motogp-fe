import React from "react";
import {Typography} from "antd";
import {getImageUrl} from "../../../utils/urlHelpers.jsx";

const {Title, Text} = Typography;

const RiderCard = ({rider, teamName, bgColor}) => {
  const {
    riderId, firstName, lastName, nationality = "Unknown", photoUrl,
  } = rider;

  const fullName = `${firstName?.trim()} ${lastName?.trim()}`.toUpperCase();
  const countryCode = nationality?.toLowerCase();
  const upperRiderId = riderId?.toUpperCase();

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg w-full aspect-[3/4] flex flex-col">

      {/* Gradient đen phía dưới chiếm 30% */}
      <div
        className="absolute bottom-0 left-0 w-full z-8 pointer-events-none"
        style={{
          height: "50%",
          background: "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.1))"
        }}
      />

      {/* Layer background gradients + ảnh */}
      <div className="relative flex-grow overflow-hidden">
        {/* Màu team (tầng nền dưới cùng) */}
        <div
          className="absolute inset-0 rounded-md z-1 transition-colors duration-500 ease-in-out"
          style={{
            background: bgColor || "gray",
            opacity: 0.8,
          }}
        />
        {/* Overlay tối thêm */}
        <div className="absolute inset-0 z-3 bg-black opacity-60 rounded-md pointer-events-none" />

        {/* Gradient trái -> phải (giống ::before) */}
        <div className="absolute inset-0 z-4 rounded-md pointer-events-none bg-[linear-gradient(300deg,transparent,#171c21_98%)]" />

        {/* Gradient trên -> dưới (giống ::after) */}
        <div className="absolute inset-0 z-7 rounded-md pointer-events-none bg-[linear-gradient(180deg,rgba(23,28,33,0),#171c21)]" />

        {/* Shadow Gradient chéo từ dưới trái lên trên phải */}
        <div
          className="absolute inset-0 z-7 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 40%)",
          }}
        />

        {/* Rider ID lớn mờ phía sau */}
        <div className="absolute font-bold left-[14%] top-[40%] transform -translate-x-[20%] -translate-y-[40%] z-4 pointer-events-none select-none text-colorText font-MGPDisplay text-[144px] italic uppercase opacity-[0.24] leading-none whitespace-nowrap">
          {upperRiderId}
        </div>

        {/* Ảnh chính (top layer) */}
        <img
          src={getImageUrl(photoUrl)}
          alt={fullName}
          className="absolute w-full h-full object-cover left-0 -bottom-[10%] scale-90 z-7 brightness-100"
        />
      </div>

      {/* Vùng thông tin tên, quốc gia, team */}
      <div className="absolute w-full bottom-0 left-0 px-4 py-6 z-10">
        {/* Rider ID nhỏ */}
        <div className="mb-1">
          <Text className="text-lg font-bold font-MGPDisplay text-white">
            {`#${upperRiderId}`}
          </Text>
        </div>

        {/* Rider Name */}
        <Title level={4} className="!text-2xl !m-0 !text-white !uppercase !font-bold font-MGPDisplay">
          {fullName}
        </Title>

        {/* Quốc gia và team */}
        <div className="flex items-center gap-2 mt-1 text-lg font-light">
          <img
            src={`https://flagcdn.com/w40/${countryCode}.png`}
            alt={nationality}
            className="w-7 h-5 rounded-sm"
          />
          <Text className="text-colorText font-MGPText capitalize whitespace-nowrap">
            {nationality}
          </Text>
          <div className="border-l-2 pl-2 border-colorText">
            <Text className="text-colorText font-MGPText capitalize">
              {teamName || "Unknown Team"}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderCard;
