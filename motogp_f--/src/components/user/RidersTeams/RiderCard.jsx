import React from "react";
import { Typography } from "antd";
import { getImageUrl } from "../../../utils/urlHelpers.jsx";

const { Title, Text } = Typography;

const RiderCard = ({ rider, teamName }) => {
    const {
        riderId,
        firstName,
        lastName,
        nationality = "Unknown",
        photoUrl,
    } = rider;

    const fullName = `${firstName?.trim()} ${lastName?.trim()}`.toUpperCase();
    const countryCode = nationality?.toLowerCase();
    const upperRiderId = riderId?.toUpperCase();

    return (
        <div className="relative rounded-lg overflow-hidden shadow-lg w-full aspect-[3/4] bg-black text-white font-sans flex flex-col">
            {/* Image container nhỏ lại */}
            <div className="relative flex-grow overflow-hidden">
                <img
                    src={getImageUrl(photoUrl)}
                    alt={fullName}
                    className="w-full h-full object-cover absolute left-0 bottom-[-54px] z-10"
                />

                {/* Gradient shadow từ dưới trái lên trên phải */}
                <div
                    className="absolute inset-0 pointer-events-none z-20"
                    style={{
                        background:
                            "linear-gradient(to top right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 40%)",
                    }}
                />

                {/* Large ID Background nằm dưới góc trái */}
                <div className="absolute bottom-0 left-1/2 bottom-1/4 transform -translate-x-1/2 pointer-events-none select-none">
                    <span className="text-[200px] font-extrabold text-gray-400 opacity-50 leading-none italic">
                        {upperRiderId}
                    </span>
                </div>
            </div>

            {/* Info area */}
            <div className="absolute w-full bottom-0 left-0 px-4 py-6 z-20 ">
                {/* Small ID phía trên tên */}
                <div className="mb-1">
                    <Text className="text-lg font-bold font-MGPDisplay text-white">{`#${upperRiderId}`}</Text>
                </div>

                <Title level={4} className="!text-2xl !m-0 !text-white !uppercase !font-bold font-MGPDisplay">
                    {fullName}
                </Title>

                <div className="flex items-center gap-2 mt-1 text-lg">
                    <img
                        src={`https://flagcdn.com/w40/${countryCode}.png`}
                        alt={nationality}
                        className="w-7 h-5 rounded-sm"
                    />
                    <Text className="text-colorText font-MGPText capitalize">{nationality}</Text>
                    <span className="text-colorText font-MGPText capitalize">|</span>
                    <Text className="text-colorText font-MGPText capitalize">{teamName || "Unknown Team"}</Text>
                </div>
            </div>
        </div>
    );
};

export default RiderCard;
