import React from "react";

const ResultsHeader = ({title}) => {
  return (
    <div className="px-12 pt-4 pb-10 relative bg-[#c80502]">
      <div className="absolute inset-0 bg-black opacity-85"></div>
      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-l to-black from-transparent"></div>
      <span className="relative text-5xl font-extrabold text-white">
        {title}
      </span>
    </div>
  );
};

export default ResultsHeader;