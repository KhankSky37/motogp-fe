// CustomArrow.jsx
import React from "react";

const CustomArrow = ({
  onClick,
  type,
  currentSlide,
  slideCount,
  slidesToShow,
}) => {
  const isPrev = type === "prev";
  const isNext = type === "next";

  // Điều kiện ẩn mũi tên
  const isDisabled =
    (isPrev && currentSlide === 0) ||
    (isNext && currentSlide >= slideCount - slidesToShow);

  if (isDisabled) return null;

  return (
 <div
  onClick={onClick}
  className={`
    absolute z-30 w-10
    flex items-center justify-center
    bg-black/70 hover:bg-red-600
    ${isNext ? "right-2" : "left-2"}
    top-1/2 -translate-y-1/2
    rounded-full
    opacity-100 transition-colors duration-300
    cursor-pointer select-none
    group/arrow
  `}
  style={{
    height: 40, // hoặc 48
  }}
>
  <span className="text-white text-2xl font-bold drop-shadow-lg">
    {isNext ? "›" : "‹"}
  </span>
</div>
  );
};

export default CustomArrow;
