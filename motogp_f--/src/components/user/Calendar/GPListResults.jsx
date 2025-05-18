import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import classNames from "classnames";
import dayjs from "dayjs";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

// Cấu hình tên quốc gia
countries.registerLocale(enLocale);

const formatDate = (date) => dayjs(date).format("DD MMM").toUpperCase();
const getCountryCode = (name) => countries.getAlpha2Code(name, "en") || "";

// Format tên tay đua
const formatName = (full) => {
    const parts = full.trim().split(/\s+/);
    if (parts.length === 0) return "";
    if (parts.length === 1)
        return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    const lastName = parts.pop();
    const firstInitial = parts[0].charAt(0).toUpperCase() + ".";
    return `${firstInitial} ${lastName.charAt(0).toUpperCase()}${lastName.slice(1).toLowerCase()}`;
};

// Podium card cho rider
const getOrdinalSuffix = (rank) => {
    if (rank === 1) return "st";
    if (rank === 2) return "nd";
    if (rank === 3) return "rd";
    return "th";
};

// Các bộ màu gradient khác nhau cho mỗi event index
const gradientSets = [
    { 1: "from-black to-red-800",    2: "from-black to-gray-400",  3: "from-black to-red-900"   }, // màu đỏ & xám
    { 1: "from-black to-blue-800",   2: "from-black to-yellow-600", 3: "from-black to-blue-900"  }, // màu xanh dương & vàng
    { 1: "from-black to-red-900",    2: "from-black to-gray-500",  3: "from-black to-red-800"   }, // màu đỏ đậm & xám
    { 1: "from-black to-blue-900",   2: "from-black to-yellow-600", 3: "from-black to-blue-800"  }, // xanh dương & vàng
    { 1: "from-black to-red-800",    2: "from-black to-gray-400",  3: "from-black to-red-900"   }, // màu đỏ & xám
];


const PodiumCard = ({ rider, gradients }) => {
    const heightMap = { 1: "h-[120px]", 2: "h-[110px]", 3: "h-[100px]" };
    // Nếu không truyền gradients thì dùng bộ mặc định
    const gradientMap = gradients || gradientSets[0];
    const width = "w-[130px]";

    return (
        <div
            className={classNames(
                "flex flex-col items-center rounded-md text-white shadow-md p-2 relative",
                `bg-gradient-to-b ${gradientMap[rider.rank]}`,
                width,
                heightMap[rider.rank]
            )}
        >
            {rider.photoUrl && (
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white absolute -top-6 bg-black">
                    <img
                        src={rider.photoUrl}
                        alt={rider.name}
                        className="absolute w-20 h-20 object-cover scale-125"
                        style={{ top: "15px", left: "5px" }}
                    />
                </div>
            )}

            {/* Container hạng + tên đặt absolute cách đáy 10px */}
            <div
                className="flex flex-col items-center absolute left-1/2"
                style={{ bottom: "10px", transform: "translateX(-50%)" }}
            >
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{rider.rank}</span>
                    <span className="text-base font-semibold">{getOrdinalSuffix(rider.rank)}</span>
                </div>
                <span className="text-base font-semibold text-center whitespace-nowrap">
          {formatName(rider.name)}
        </span>
            </div>
        </div>
    );
};

const GPListResults = ({ index, eventName, officialName, startDate, endDate, riders = [] }) => {
    const [isHovered, setIsHovered] = useState(false);

    const countryCode = getCountryCode(eventName);

    // Lấy bộ màu tương ứng với index (để mỗi sự kiện có màu Podium khác)
    const gradients = gradientSets[index % gradientSets.length];

    return (
        <div
            className="flex relative w-full rounded-xl overflow-hidden shadow-md transition-shadow cursor-pointer px-[20px] py-5"
            style={{
                backgroundColor: "#ffffff",
                boxShadow: isHovered ? "0 0 1rem rgba(0,0,0,0.25)" : "0 2px 26px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* LEFT: Thông tin GP */}
            <div className="flex flex-col gap-1 w-2/3 relative">
                {/* Flag + name */}
                <div className="flex items-center gap-1">
                    <ReactCountryFlag
                        countryCode={countryCode}
                        svg
                        style={{
                            width: "36px",
                            height: "24px",
                            filter: "contrast(1.2) saturate(1.3)",
                        }}
                        title={eventName}
                    />

                    {/* Date */}
                    <div className="text-base font-bold tracking-wide text-gray-500">
                        {formatDate(startDate)} - {formatDate(endDate)}
                    </div>
                </div>

                {/* Event Name with index */}
                <div className="text-[40px] font-extrabold uppercase text-black flex items-center gap-1">
                    <span className="text-gray-500 font-bold">{index + 1}</span>
                    <span className="tracking-wide">{eventName}</span>
                </div>

                {/* Official Name */}
                <div className="text-base font-medium leading-snug text-gray-400">{officialName}</div>
            </div>

            {/* RIGHT: Top 3 Riders */}
            <div className="flex absolute bottom-0 right-0 items-end gap-1">
                {[2, 1, 3]
                    .map((rank) => riders.find((r) => r.rank === rank))
                    .filter(Boolean)
                    .map((rider, idx) => (
                        <PodiumCard key={idx} rider={rider} gradients={gradients} />
                    ))}
            </div>
        </div>
    );
};

export default GPListResults;
