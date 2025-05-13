import React from "react";
import bgHome from "../../assets/bg_home.jpg";
import { Button } from "antd";
import NewsSection from "../../components/NewsSection/NewsSection.jsx";

const Home = () => {
    return (
        <div className="bg-gray-100">
            {/* Hero Section */}
            <div
                className="relative flex justify-start h-[600px] bg-cover bg-center"
                style={{ backgroundImage: `url(${bgHome})` }}
            >
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-b to-black from-transparent"></div>
                <div className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-l to-black from-transparent"></div>

                <div className="absolute inset-x-16 text-white top-1/2 w-[600px]">
                    <h1 className="text-2xl font-bold mb-4">Welcome to MotoGP</h1>
                    <p className="text-4xl font-extrabold mb-8">
                        HOT HEADLINES AHEAD OF LE MANS: will home heroes mix it up with title contenders?
                    </p>
                    <Button type="primary" size="large">Get Started</Button>
                </div>
            </div>

            {/* News Section nằm ngoài hero */}
            <NewsSection />
        </div>
    );
};

export default Home;
