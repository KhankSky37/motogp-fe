import React from 'react';
import {ConfigProvider, Tabs} from "antd";
import videoBg from "../../assets/videoBg.webp";

const Videos = () => {
  const items = [
    {
      key: "OVERVIEW",
      label: "OVERVIEW",
    },
    {
      key: "FOR_YOU",
      label: "FOR YOU",
    },
    {
      key: "SEARCH",
      label: "SEARCH",
    },
    {
      key: "AFTER_THE_FLAG",
      label: "AFTER THE FLAG",
    },
  ];
  return (
    <>
      <div className="px-12 pt-4 pb-10 relative bg-[#c80502]">
        <div className="absolute inset-0 bg-black opacity-85"></div>
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-l to-black from-transparent"></div>
        <span className="relative text-5xl font-extrabold text-white font-MGPDisplay">
        VIDEOS
      </span>
      </div>
      <div className={"px-12 bg-black"}>
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                itemColor: "#ffffff",
                itemSelectedColor: "#ffffff",
                itemHoverColor: "#ffffff",
                inkBarColor: "#ffffff",
              },
            },
          }}
        >
          <Tabs items={items} rootClassName={"relative"}/>
        </ConfigProvider>
      </div>

      <div
        className="relative flex justify-start h-[600px] bg-cover bg-center"
        style={{backgroundImage: `url(${videoBg})`}}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-b to-black from-transparent"></div>
        <div className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-l to-black from-transparent"></div>

        <div className="absolute inset-x-16 text-white top-1/2 w-[600px]">
          <h1 className="mb-4 font-MGPText">MotoGP™</h1>
          <p className="text-4xl font-extrabold mb-8 font-MGPDisplay">
            More drama awaits as MotoGP gets set for Silverstone
          </p>
          <button className={'bg-red-700 p-2 px-6 rounded-3xl font-MGPText'}>
            Watch Now
          </button>
        </div>
      </div>
    </>
  );
};

export default Videos;