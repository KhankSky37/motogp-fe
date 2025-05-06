import React from "react";
import bgHome from "../../assets/bg_home.jpg";
import { Button } from "antd"; // Import hình ảnh từ thư mục assets

const Home = () => {
  return (
    <div
      className="relative flex justify-start h-[600px] bg-cover bg-center"
      style={{ backgroundImage: `url(${bgHome})` }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-b to-black from-transparent"></div>
      <div className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-l to-black from-transparent"></div>

      <div className="absolute inset-x-16 text-white top-1/2">
        <h1 className="text-4xl font-bold mb-4">Welcome to MotoGP</h1>
        <p className="text-lg mb-8">
          Experience the thrill of MotoGP like never before!
        </p>
        <Button type="primary" size="large">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Home;
