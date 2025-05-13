import React from "react";
import bgHome from "../../assets/bg_home.jpg";
import fanClub from "../../assets/01_1579x970-Single-Promo-Home-MGP-Campaign_fan_club.webp";
import bestMoments from "../../assets/Best-Moments-Promo.webp";
import discount from "../../assets/MGP_2025_VP_1st_Price_Drop_WEB_Single_Promo_Home-1-.webp";
import { Button } from "antd";
import NewsSection from "../../components/user/home/NewsSection/NewsSection.jsx";
import FeaturedContent from "../../components/user/home/FeaturedContent/FeaturedContent.jsx";

const Home = () => {
  return (
      <>
        {/* Hero section với background */}
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
            <Button variant="solid" color={"danger"} size="large">
              Get Started
            </Button>
          </div>
        </div>

          <FeaturedContent
              title="Best MotoGP™ Moments 👏 | 2025 French GP"
              description="Absolute scenes of a Grand Prix in Le Mans with flag-to-flag drama, heartbreaks, and a whole load of emotion in a surprise winner! 🙌 Check out the key moments of a crazy day of racing! 👀"
              buttonText="watch youtube"
              buttonLink="https://www.youtube.com/watch?v=VW1LuToz6Wo"
              imageUrl={bestMoments}
          />

          <FeaturedContent
              title="25% OFF"
              description="Tune in for the rest of 2025 with MotoGP™ VideoPass and enjoy every second of every round"
              buttonText={"subscribe now"}
              buttonLink="https://subscribe.motogp.com/en/subscribe?utm_source=banner&utm_medium=sp&utm_campaign=videopass&utm_content=1stdrop&_gl=1%2a14dm5tv%2a_gcl_au%2aNDc4MzkyMTgzLjE3NDUyNjY4MDc.%2a_ga%2aMTc2OTk2NjE4Mi4xNzQ1MjY2ODEw%2a_ga_0204YNR4C1%2aczE3NDcxNDYxNjUkbzIxJGcxJHQxNzQ3MTQ4MzE0JGo1NSRsMCRoMA.."
              imageUrl={discount}
              reverse={true}
          />
          {/* Tách NewsSection ra ngoài ảnh nền */}
        <NewsSection />

          <FeaturedContent
              title="Even MORE MotoGP™ – Join the MotoGP™ Fan Club!"
              description="Show your loyalty to the world's most exciting sport, become part of the community and unlock amazing experiences! Enjoy VIP access, special discounts, and exclusive fan experiences with the MotoGP™ Fan Club."
              buttonText="JOIN NOW!"
              buttonLink="https://fanclub.motogp.com/?utm_source=motogp.com&utm_medium=link&utm_content=fanclub2025singlepromo&utm_campaign=fanclub&_gl=1*1jz3u8p*_gcl_au*NDc4MzkyMTgzLjE3NDUyNjY4MDc.*_ga*MTc2OTk2NjE4Mi4xNzQ1MjY2ODEw*_ga_0204YNR4C1*czE3NDcxNDYxNjUkbzIxJGcxJHQxNzQ3MTQ3OTQ0JGo1MSRsMCRoMA.."
              imageUrl={fanClub}
          />
      </>
  );
};

export default Home;
