import React from 'react';
import bgHome from '../../assets/bg_home.jpg';
import {Button} from "antd"; // Import hình ảnh từ thư mục assets

const Home = () => {
  return (
    <div
      className="min-h-[812px] w-full bg-cover bg-center flex items-end justify-start bg-gradient-to-b from-transparent to-black"
      style={{ backgroundImage: `url(${bgHome})` }}
    >

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black h-full w-full"></div>
      <div className={"relative text-white p-12 space-y-6"}>
        <div className={"text-xl"}>MotoGP™</div>
        <div className={"text-6xl font-extrabold w-3/5"}>Aprilia provide update on Martin's recovery</div>
        <Button className={"bg-red-600"} >READ NOW</Button>
      </div>
      <div>test conflict</div>
    </div>
  );
};

export default Home;