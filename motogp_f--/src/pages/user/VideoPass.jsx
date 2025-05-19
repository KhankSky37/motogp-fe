import React from 'react';
import videopassImg from '../../assets/MotoGP-VIDEOPASS.webp'
import {ConfigProvider, Tabs} from "antd";
import bgHome from "../../assets/MGP-GP-FR.webp";


const VideoPass = () => {
  const items = [
    {
      key: "OVERVIEW",
      label: "OVERVIEW",
    },
    {
      key: "CURRENT_SEASON",
      label: "CURRENT SEASON",
    },
    {
      key: "ARCHIVE",
      label: "ARCHIVE",
    },
    {
      key: "DOCUMENTARIES",
      label: "DOCUMENTARIES",
    },
    {
      key: "COLLECTIONS",
      label: "COLLECTIONS",
    },
    {
      key: "SEARCH",
      label: "SEARCH",
    },
  ];
  return (
    <>
      <div
        className="relative flex flex-col h-[138px] bg-cover bg-center items-center justify-center"
        style={{
          backgroundColor: '#0a0a0a',
          backgroundImage: `
          repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.05) 0px,
            rgba(255, 255, 255, 0.05) 1px,
            transparent 1px,
            transparent 12px
          ),
          repeating-linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.05) 0px,
            rgba(255, 255, 255, 0.05) 1px,
            transparent 1px,
            transparent 12px
          )`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <img src={videopassImg} className={'h-9'}/>
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
        style={{backgroundImage: `url(${bgHome})`}}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-b to-black from-transparent"></div>
        <div className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-l to-black from-transparent"></div>

        <div className="absolute inset-x-16 text-white top-1/2 w-[600px]">
          <h1 className="mb-4">MotoGP™</h1>
          <p className="text-4xl font-extrabold mb-8">
            MotoGP™ Grand Prix: Michelin® Grand Prix of France
          </p>
          <button className={'bg-red-700 p-2 px-6 rounded-3xl'}>
            Watch Now
          </button>

        </div>
      </div>
    </>
  );
};

export default VideoPass;