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

  const isDisabled =
    (isPrev && currentSlide === 0) ||
    (isNext && currentSlide >= slideCount - slidesToShow);

  if (isDisabled) return null;

  return (
    <div
      onClick={onClick}
      className={`
        absolute top-0 bottom-0 w-10 z-30
        flex items-center justify-center
        bg-[#2B2D30]
        ${isNext ? "-right-12" : "-left-12"}
        hidden group-hover:block
        cursor-pointer transition-colors duration-200
        opacity-70
      `}
    >
      <span className="absolute text-white text-base font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {isNext ? "›" : "‹"}
      </span>
    </div>
  );
};

export default CustomArrow;
