import React from "react";
import classNames from "classnames";

// Component hiển thị từng ô Podium của rider
const PodiumCard = ({ rider, gradients }) => {
  // Map chiều cao theo thứ hạng (cao dần từ 3 → 1)
  const heightMap = {
    1: "h-[120px]",
    2: "h-[110px]",
    3: "h-[100px]",
  };

  // Lấy gradient theo thứ hạng (dùng default nếu không truyền)
  const gradientMap = gradients || {
    1: "from-black to-red-800",
    2: "from-black to-gray-400",
    3: "from-black to-red-900",
  };

  // Hàm xử lý hậu tố thứ hạng (1st, 2nd, 3rd, 4th, ...)
  const getOrdinalSuffix = (rank) => {
    const suffixMap = { 1: "st", 2: "nd", 3: "rd" };
    return suffixMap[rank] || "th";
  };

  // Format tên: "Marc Marquez" → "M. Marquez"
  const formatName = (full) => {
    const parts = full.trim().split(/\s+/);
    if (parts.length === 0) return "";
    if (parts.length === 1)
      return parts[0][0].toUpperCase() + parts[0].slice(1).toLowerCase();
    const lastName = parts.pop();
    const firstInitial = parts[0][0].toUpperCase() + ".";
    return `${firstInitial} ${lastName[0].toUpperCase()}${lastName.slice(1).toLowerCase()}`;
  };

  return (
    <div
      className={classNames(
        "flex flex-col items-center rounded-md text-white shadow-md p-2 relative font-MGPText",
        `bg-gradient-to-b ${gradientMap[rider.rank]}`,
        "w-[130px]",
        heightMap[rider.rank]
      )}
    >
      {/* Avatar của rider (nếu có) */}
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

      {/* Phần nội dung dưới cùng: hạng + tên */}
      <div
        className="flex flex-col items-center absolute left-1/2"
        style={{ bottom: "10px", transform: "translateX(-50%)" }}
      >
        {/* Số hạng + hậu tố */}
        <div className="flex items-baseline gap-1 font-MGPDisplay font-light">
          <span className="text-[24px] leading-none  tracking-tight font-MGPDisplay">
            {rider.rank}
          </span>
          <span className="text-xs tracking-wide">
            {getOrdinalSuffix(rider.rank)}
          </span>
        </div>

        {/* Tên rút gọn (dưới rank) */}
        <span className="text-base font-MGPText font-medium tracking-wide text-center whitespace-nowrap">
          {formatName(rider.name)}
        </span>
      </div>
    </div>
  );
};

export default PodiumCard;
