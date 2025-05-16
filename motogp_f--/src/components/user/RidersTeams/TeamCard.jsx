import React from "react";
import { Typography } from "antd";
import { getImageUrl } from "../../../utils/urlHelpers";

const { Title } = Typography;

const TeamCard = ({ team }) => {
    const { name, logoPath, riders = [] } = team;
    const upperName = name?.toUpperCase();

    return (
        <div className="relative rounded-xl overflow-hidden shadow-md w-full aspect-[4/4] bg-black text-white font-sans flex flex-col justify-end">
            {/* Overlay gradient từ dưới lên */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black via-black/80 to-transparent" />

            {/* Ảnh xe/moto ở giữa */}
            <div className="absolute top-1 left-1/2 w-3/4 -translate-x-1/2 z-0">
                <img
                    src={getImageUrl(logoPath)}
                    alt={name}
                    className="mx-auto max-h-[70%] object-contain"
                />
            </div>

            {/* Tên đội & danh sách tay đua */}
            <div className="relative px-5 pb-3 z-20">
                <Title
                    level={4}
                    className="!m-0 text-[22px] uppercase font-extrabold leading-none tracking-wide"
                    style={{
                        color: "#fff",
                        WebkitTextStroke: "0.5px #000",
                    }}
                >
                    {upperName}
                </Title>

                {/* Danh sách tay đua viết hoa chữ cái đầu */}
                <div className="mt-2 flex flex-col text-sm text-white/90">
                    {riders.map((rider) => (
                        <span key={rider.id} className="capitalize">
                            {rider.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamCard;
