import React from "react";
import { ConfigProvider, Layout, Menu } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import motogp from "../assets/motogp1.jpg";
import bwm from "../assets/BMW-M_logo.webp";
import dhl from "../assets/DHL_logo.webp";
import estrellaGalicia from "../assets/EstrellaGalicia_Logo.webp";
import michelin from "../assets/MICHELIN_logo.webp";
import sponsor from "../assets/sponsor-qatar.webp";
import tissot from "../assets/Tissot_Main_Sponsor.webp";
import app_store from "../assets/app-store.webp";
import play_store from "../assets/play-store.webp";

const { Header, Content, Footer } = Layout;

const DefaultLayout = () => {
  const navigate = useNavigate();

  const items = [
    {
      key: "calendar",
      label: "Calendar",
    },
    {
      key: "sessions",
      label: "Sessions",
    },
    {
      key: "Results&Standings",
      label: "Results & Standings",
    },
    {
      key: "Riders&Team",
      label: "Riders & Team",
    },
    {
      key: "VideoPass",
      label: "VideoPass",
    },
    {
      key: "Videos",
      label: "Videos",
    },
    {
      key: "News",
      label: "News",
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key === "sessions") {
      navigate("/sessions");
    } else if (e.key === "Results&Standings") {
      navigate("/gp-results");
    } else if (e.key === "News") {
      navigate("/news");
    }
    else if (e.key === "Riders&Team") {
      navigate("/Riders");
    }
  };

  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 999,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
        className={"bg-black"}
      >
        <Link to="/">
          <img
            src={motogp}
            alt="MotoGP Logo"
            style={{ height: 40, marginRight: 16, width: 200 }}
          />
        </Link>
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                darkItemSelectedBg: "#8c8c8c",
              },
            },
          }}
        >
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={items}
            onClick={handleMenuClick}
            style={{ flex: 1, minWidth: 0 }}
            className="text-white font-medium bg-black"
          />
        </ConfigProvider>

        <div className={"text-[#e5e7eb] divide-x-2"}>
          <span className={"px-2"}>Login</span>
          <span className={"px-2"}>Register</span>
        </div>
      </Header>
      <Content>
        <Outlet />
      </Content>
      <Footer className={"py-4 border-t"} style={{ margin: 0, padding: 0 }}>
        <div className={"border-b p-6"}>
          <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1174.72 188"
            className={"w-[200px] h-8 mx-auto"}
          >
            <path d="M624.48,29.57h37.41v45h-37.35l.08,61.32c0,2.2,1.78,3.98,3.98,3.98h33.3v45h-33.55c-27.49,0-49.77-22.46-49.77-49.95V0h45.87l.04,29.57ZM484.63,21.58c-45.95,0-83.21,37.25-83.21,83.21s37.25,83.21,83.21,83.21,83.21-37.25,83.21-83.21-37.25-83.21-83.21-83.21ZM484.63,143.54c-20.65,0-37.4-18.09-37.4-38.74s16.74-38.74,37.4-38.74,37.4,18.09,37.4,38.74-16.74,38.74-37.4,38.74ZM748.88,21.58c-45.95,0-83.21,37.25-83.21,83.21s37.25,83.21,83.21,83.21,83.21-37.25,83.21-83.21-37.25-83.21-83.21-83.21ZM748.88,143.54c-20.65,0-37.4-18.09-37.4-38.74s16.74-38.74,37.4-38.74,37.4,18.09,37.4,38.74-16.74,38.74-37.4,38.74ZM366.68,17.47c-17.54-9.12-38.8-5.59-52.3,8.36l-89.14,98.86c-1.83,1.9-5.05.61-5.05-2.03V57c0-24.61-19.88-44.57-44.49-44.57-12.36,0-24.99,4.93-32.51,13.26L0,184.89h66.04l99.68-110.8c1.83-1.9,5.04-.6,5.04,2.04v66.74c0,18.62,11.55,35.08,29.24,41.35,16.61,5.89,36.2.81,48.07-11.99l88.16-97.84c1.83-1.9,5.04-.6,5.04,2.04v108.46h49.43V57.01c0-16.52-9.15-31.82-24.02-39.54h0ZM1114.52,12.45h-183.71c-47.54,0-86.22,38.68-86.22,86.22s38.68,86.22,86.22,86.22h144.11v-51.79h42.05c32.07-1.29,57.75-27.95,57.75-60.33s-27.01-60.33-60.2-60.33ZM1005.84,64.24h-75.03c-18.99,0-34.43,15.45-34.43,34.43s15.45,34.43,34.43,34.43h40.22v-17.08h-40.22c-9.57,0-17.36-7.79-17.36-17.36s7.79-17.36,17.36-17.36h75.03v86.5h-75.03c-38.13,0-69.15-31.02-69.15-69.15s31.02-69.15,69.14-69.15h75.04s0,34.71,0,34.71ZM1114.51,116.03h-56.68v51.79h-34.92v-86.5h91.6c4.72,0,8.54-3.82,8.54-8.54s-3.82-8.54-8.54-8.54h-91.6V29.52h91.6c23.78,0,43.13,19.47,43.13,43.25s-19.35,43.25-43.13,43.25ZM1096.18,184.89h3.15v-14.05h5.39v-3.02h-13.9v3.02h5.36v14.05ZM1107.89,184.89h3.12v-11.88l3.88,6.51h2.56l3.9-6.66v12.02h3.12v-17.07h-3.29l-4.97,8.41-5.02-8.41h-3.29v17.07h0Z" />
          </svg>
        </div>
        <div className={"p-2 flex flex-col items-center border-b"}>
          <h6 className={"text-neutral-400"}>Official Sponsors</h6>
          <ul className="flex justify-center gap-20 items-center my-4">
            <li>
              <a href="https://www.qatarairways.com/es-es/homepage.html">
                <img className="w-[60px] h-auto" src={sponsor} alt="logo" />
              </a>
            </li>
            <li>
              <a href="https://www.tissotwatches.com/en-en">
                <img className="w-[60px] h-auto" src={tissot} alt="logo" />
              </a>
            </li>
            <li>
              <a href="https://www.michelinmotorsport.com/en/motorsport/">
                <img className="w-[60px] h-auto" src={michelin} alt="logo" />
              </a>
            </li>
            <li>
              <a href="https://www.bmw-m.com/en/fastlane/motogp.html">
                <img className="w-[60px] h-auto" src={bwm} alt="logo" />
              </a>
            </li>
            <li>
              <a href="https://estrellagalicia00.es/">
                <img
                  className="w-[60px] h-auto"
                  src={estrellaGalicia}
                  alt="logo"
                />
              </a>
            </li>
            <li>
              <a href="https://www.dhl.com/vn-vi/home/about-us/partnerships.html?locale=true">
                <img className="w-[60px] h-auto" src={dhl} alt="logo" />
              </a>
            </li>
          </ul>
        </div>
        <div className="flex justify-between gap-x-16 py-6 px-32">
          {/* Cột 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Media & Commercial</h3>
            <ul className="space-y-2 text-[18px]">
              <li>
                <a href="#">Official Sponsors</a>
              </li>
              <li>
                <a href="#">TV Broadcast</a>
              </li>
              <li>
                <a href="#">MotoGP™ Apps</a>
              </li>
            </ul>
          </div>

          {/* Cột 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-[18px]">
              <li>
                <a href="#">Contact us</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Glossary</a>
              </li>
              <li>
                <a href="#">About MotoGP™</a>
              </li>
              <li>
                <a href="#">Join MotoGP™</a>
              </li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Tickets & Hospitality
            </h3>
            <ul className="space-y-2 text-[18px]">
              <li>
                <a href="#">Tickets</a>
              </li>
              <li>
                <a href="#">Hospitality</a>
              </li>
              <li>
                <a href="#">Experiences</a>
              </li>
            </ul>
          </div>

          {/* Cột 4 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Game Hub</h3>
            <ul className="space-y-2 text-[18px]">
              <li>
                <a href="#">MotoGP™ Fantasy</a>
              </li>
              <li>
                <a href="#">MotoGP™ Predictor</a>
              </li>
              <li>
                <a href="#">MotoGP™ eSport</a>
              </li>
              <li>
                <a href="#">MotoGP™ Guru</a>
              </li>
              <li>
                <a href="#">MotoGP™25</a>
              </li>
            </ul>
          </div>

          {/* Cột 5 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <ul className="space-y-2 text-[18px]">
              <li>
                <a href="#">Dorna Sports</a>
              </li>
              <li>
                <a href="#">Cookie Policy</a>
              </li>
              <li>
                <a href="#">Legal Notice</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Purchase Policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between items-center border-b px-10">
          <div className="flex gap-4 items-center">
            <p className="text-lg font-semibold">
              Download the Official <br /> MotoGP™ App
            </p>
            <img className="w-[118px] h-auto" src={app_store} alt="logo" />
            <img className="w-[118px] h-auto" src={play_store} alt="logo" />
          </div>

          <div className="flex flex-wrap gap-8 py-8 text-gray-500 text-xl justify-end">
            {/* Các icon đầu */}
            <a href="#">
              <i className="fab fa-facebook-f hover:text-black"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram hover:text-black"></i>
            </a>
            <a href="#">
              <i className="fab fa-threads hover:text-black"></i>
            </a>
            <a href="#">
              <i className="fab fa-x-twitter hover:text-black"></i>
            </a>
            <a href="#">
              <i className="fab fa-tiktok hover:text-black"></i>
            </a>
            <a href="#">
              <i className="fab fa-youtube hover:text-black"></i>
            </a>
            <a href="#">
              <i className="fab fa-linkedin-in hover:text-black"></i>
            </a>
            <a href="#">
              <i className="fas fa-podcast hover:text-black"></i>
            </a>
            <a href="#">
              <i className="fab fa-snapchat-ghost hover:text-black"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitch hover:text-black"></i>
            </a>
            {/* 2 icon cuối */}
            <div className="w-full flex gap-4 justify-end">
              <a href="#">
                <i className="fab fa-whatsapp hover:text-black"></i>
              </a>
              <a href="#">
                <i className="fab fa-telegram-plane hover:text-black"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="px-10 py-4">
          ©{new Date().getFullYear()} Dorna Sports SL. All rights reserved. All
          trademarks are the property of their respective owners.
        </div>
      </Footer>
    </Layout>
  );
};
export default DefaultLayout;
