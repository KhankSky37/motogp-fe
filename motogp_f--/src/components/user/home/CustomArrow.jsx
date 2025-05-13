// CustomArrow.jsx
import React from "react";

const CustomArrow = ({ onClick, type, currentSlide, slideCount, slidesToShow }) => {
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
                absolute top-0 bottom-0 z-20 w-8
                flex items-center justify-center
                bg-black/40 hover:bg-black/60
                ${isNext ? "right-0" : "left-0"}
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                cursor-pointer
            `}
        >
            <span className="text-white text-xl">
                {isNext ? "›" : "‹"}
            </span>
        </div>
    );
};

export default CustomArrow;