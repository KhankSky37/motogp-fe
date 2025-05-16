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
            <div className="relative px-4 py-3 z-20 bg-black/70">
                {/* Small ID phía trên tên */}
                <div className="mb-1">
                    <Text className="text-lg font-bold font-mono text-white">{`#${upperRiderId}`}</Text>
                </div>

                <Title level={4} className="!m-0 !text-white !uppercase !font-extrabold leading-tight">
                    {fullName}
                </Title>

                <div className="flex items-center gap-2 mt-1 text-sm opacity-90">
                    <img
                        src={`https://flagcdn.com/w40/${countryCode}.png`}
                        alt={nationality}
                        className="w-6 h-4 rounded"
                    />
                    <Text className="text-white">{nationality}</Text>
                    <span className="mx-2 text-white">|</span>
                    <Text className="text-white">{teamName || "Unknown Team"}</Text>
                </div>
            </div>
        </div>
    );
};

export default RiderCard;
