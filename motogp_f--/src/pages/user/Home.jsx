import React from "react";
import bgHome from "../../assets/bg-Home.webp";
import fanClub from "../../assets/01_1579x970-Single-Promo-Home-MGP-Campaign_fan_club.webp";
import bestMoments from "../../assets/Best-Moments-Promo.webp";
import discount from "../../assets/MGP_2025_VP_1st_Price_Drop_WEB_Single_Promo_Home-1-.webp";
import { Button } from "antd";
import NewsSection from "../../components/user/home/NewsSection.jsx";
import TshirtsSection from "../../components/user/home/TshirtsSection.jsx";
import FeaturedContent from "../../components/user/home/FeaturedContent.jsx";
import { useNewsList } from "../../hooks/useNewsArticles.jsx"
import { getImageUrl } from "../../utils/urlHelpers.jsx";
import TicketsSection from "../../components/user/home/TicketsSection.jsx";
import UpcomingSection from "../../components/user/home/UpcomingSection.jsx";

const Home = () => {
  const { articles, loading } = useNewsList();

  const latestThree = articles
    .slice()
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    .slice(0, 3);

  const items = [
    "Schedule",
    "Results",
    "Standings",
    "Entry List",
    "Watch Videos",
    "Circuit Records",
    "Official Programme",
    "Starting Grid",
  ];

  return (
    <>
      {/* Hero section với background */}
      <div
        className="relative flex justify-start h-[800px] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgHome})`, backgroundPosition: 'top' }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-b to-black from-transparent"></div>
        <div className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-l to-black from-transparent"></div>

        <div className="absolute text-white left-0 bottom-0 p-12 w-full overflow-hidden">
          <h1 className="text-lg font-medium mb-4 font-MGPText">MotoGP™</h1>
          <p className="text-[40px] font-extrabold mb-8 font-MGPDisplay w-[60%]">
            HOT HEADLINES AHEAD OF LE MANS: will home heroes mix it up with
            title contenders?
          </p>
          <Button variant="solid" color={"danger"} size="large" className={"!bg-red-700 rounded-full font-MGPText font-semibold text-sm uppercase"}>
            read now
          </Button>
          {!loading && latestThree.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-1 w-full overflow-hidden">
              {latestThree.map((article) => (
                <a
                  key={article.id}
                  href={article.articleLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex rounded-lg overflow-hidden group transition bg-white no-underline"
                >
                  {/* Ảnh bên trái (40%) */}
                  <img
                    src={getImageUrl(article.imageUrl)}
                    alt="thumb"
                    className="w-[40%] h-full object-cover"
                  />

                  {/* Nội dung bên phải */}
                  <div className="w-3/5 p-3 flex flex-col justify-between">
                    <h4 className="text-black text-base font-medium font-MGPText line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-xs text-colorText font-MGPText mt-2">
                      {new Date(article.publishDate).toLocaleDateString()}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-8 gap-4 text-base font-MGPDisplay font-bold text-white p-12">
        {items.map((label) => (
          <div
            key={label}
            className="flex items-center justify-center text-center p-5 bg-[#171C21] transition duration-200 ease-in-out hover:-translate-y-1"
          >
            {label}
          </div>
        ))}
      </div>

      <FeaturedContent
        title="Best MotoGP™ Moments 👏 | 2025 French GP"
        description="With the 2025 French GP now fast approaching, relive the countless memories of the classic race!"
        buttonText="Watch Now"
        buttonLink="https://www.motogp.com/en/videos/2025/04/26/best-moments-2025-french-gp/516773"
        imageUrl={bestMoments}
      />

      <UpcomingSection />

      <FeaturedContent
        title="Price Drop! Get VideoPass at 44% off!"
        description="The championship battle is only just heating up! Get your 2025 VideoPass before this offer ends!"
        buttonText="Subscribe Now"
        buttonLink="https://subscribe.motogp.com/en/subscribe?utm_source=banner&utm_medium=sp&utm_campaign=videopass&utm_content=1stdrop&_gl=1%2a14dm5tv%2a_gcl_au%2aNDc4MzkyMTgzLjE3NDUyNjY4MDc.%2a_ga%2aMTc2OTk2NjE4Mi4xNzQ1MjY2ODEw%2a_ga_0204YNR4C1%2aczE3NDcxNDYxNjUkbzIxJGcxJHQxNzQ3MTQ4MzE0JGo1NSRsMCRoMA.."
        imageUrl={discount}
        reverse={true}
      />

      {/* Phiên bản ẩn đi các slide bên ngoài khung (mặc định) */}
      <div className="mb-8">
        <NewsSection showOverflow={true} />
      </div>

      {/*/!* Phiên bản hiển thị các slide bên ngoài khung *!/*/}
      {/*<div className="mb-8">*/}
      {/*  <NewsSection showOverflow={true} />*/}
      {/*</div>*/}
      <UpcomingSection />

      <FeaturedContent
        title="Visit the Official MotoGP™ Fan Club"
        description="Join the Fan Club community on MotoGP™! Get even more out of every Grand Prix, exciting content, live streaming of specific sessions and exclusive products!"
        buttonText="Join Now"
        buttonLink="https://fanclub.motogp.com/?utm_source=motogp.com&utm_medium=link&utm_content=fanclub2025singlepromo&utm_campaign=fanclub&_gl=1*1jz3u8p*_gcl_au*NDc4MzkyMTgzLjE3NDUyNjY4MDc.*_ga*MTc2OTk2NjE4Mi4xNzQ1MjY2ODEw*_ga_0204YNR4C1*czE3NDcxNDYxNjUkbzIxJGcxJHQxNzQ3MTQ3OTQ0JGo1MSRsMCRoMA.."
        imageUrl={fanClub}
      />
      <TicketsSection />

      <TshirtsSection />

      <div className="text-center bg-[#171C21] text-white p-6">
        <h1 className="text-[32px] font-MGPDisplay font-bold mb-4">Get the official MotoGP™ Newsletter!</h1>
        <p className="font-MGPText font-light text-lg px-16 mb-4">Create a MotoGP™ account now and gain access to exclusive content, such as the MotoGP™ Newsletter, which features GP Reports, incredible videos and other interesting information about our sport.</p>
        <button className="px-4 py-2 text-sm font-bold bg-white uppercase font-MGPText text-black rounded-full">
          sign up for free
        </button>
      </div>
    </>
  );
};

export default Home;
