import React, {useEffect, useState} from "react";
import {Button, ConfigProvider, Dropdown, Layout, Menu, message, Space} from "antd";
import {Link, Outlet, useNavigate} from "react-router-dom";
import motogp from "../assets/motogp1.jpg";
import bwm from "../assets/BMW-M_logo.webp";
import dhl from "../assets/DHL_logo.webp";
import estrellaGalicia from "../assets/EstrellaGalicia_Logo.webp";
import michelin from "../assets/MICHELIN_logo.webp";
import sponsor from "../assets/sponsor-qatar.webp";
import tissot from "../assets/Tissot_Main_Sponsor.webp";
import app_store from "../assets/app-store.webp";
import play_store from "../assets/play-store.webp";
import {DownOutlined, MenuOutlined} from "@ant-design/icons";
import AuthService from "../services/AuthService.jsx";

const {Header, Content, Footer} = Layout;

const DefaultLayout = () => {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("motogp_user");
    if (userString) {
      try {
        setLoggedInUser(JSON.parse(userString));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem("motogp_user"); // Clear corrupted item
        localStorage.removeItem("motogp_token");
      }
    }
  }, []); // Runs once on component mount

  const handleLogout = async () => {
    const token = localStorage.getItem("motogp_token");
    if (token) {
      try {
        await AuthService.logout(token); // Gọi API logout của backend
      } catch (error) {
        console.error("Logout API call failed:", error);
        // Vẫn tiếp tục logout ở client dù API lỗi
      }
    }
    localStorage.removeItem("motogp_user");
    localStorage.removeItem("motogp_token");
    setLoggedInUser(null); // Giả sử bạn có state này để cập nhật UI
    message.success("Logged out successfully!");
    navigate("/login");
  };
  const items = [
    {
      key: "calendar",
      label: "Calendar",
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
    } else if (e.key === "Riders&Team") {
      navigate("/Riders");
    } else if (e.key === "VideoPass") {
      navigate("/videopass");
    } else if (e.key === "Videos") {
      navigate("/videos");
    } else if (e.key === "calendar") {
      navigate("/calendar");
    }
  };

  const languageMenu = (
    <Menu>
      <Menu.Item key="en">ENG</Menu.Item>
      <Menu.Item key="vn">VN</Menu.Item>
    </Menu>
  );

  return (
    <Layout className="text-[#C6C6C6]">
      <div
        className="bg-black text-gray-300 px-4 sm:px-8 py-2 flex justify-end font-MGPText sm:text-sm border-b border-white">
        <div className="flex items-center space-x-3 sm:space-x-4 overflow-x-auto">
          <span className="hover:text-white whitespace-nowrap cursor-pointer">Tickets</span>
          <span className="hover:text-white whitespace-nowrap cursor-pointer">Hospitality</span>
          <span className="hover:text-white whitespace-nowrap cursor-pointer">Experiences</span>
          <span className="hover:text-white whitespace-nowrap cursor-pointer">Store</span>
          <span className="hover:text-white whitespace-nowrap cursor-pointer">Authentics</span>
          <span className="hover:text-white whitespace-nowrap font-semibold cursor-pointer">
            <span className="italic font-bold text-red-600">M</span>GP <span className="text-red-600">TIMINGPASS</span>
          </span>
          <span className="hover:text-white whitespace-nowrap font-semibold cursor-pointer">
            <span className="italic font-bold text-red-600">M</span>GP <span className="text-red-600">VIDEOPASS</span>
          </span>
          <Button type="primary" danger
                  className="!bg-red-700 py-1 hover:bg-red-700 border-red-600 hover:border-red-700 h-8 sm:h-auto text-xs sm:text-sm px-3 sm:px-4 rounded-xl">
            SUBSCRIBE
          </Button>
          <Dropdown dropdownRender={() => languageMenu} className={"px-4"}>
            <a onClick={(e) => e.preventDefault()} className="hover:text-white flex items-center cursor-pointer">
              <Space>
                ENG
                <DownOutlined style={{fontSize: '10px'}}/>
              </Space>
            </a>
          </Dropdown>
          <span className="hover:text-white cursor-pointer">
            <span className="italic font-extrabold text-lg">FIM</span>
          </span>
        </div>
      </div>
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
        <MenuOutlined className={'text-white mr-4'}/>
        <Link to="/">
          <img
            src={motogp}
            alt="MotoGP Logo"
            style={{height: 40, marginRight: 16, width: 200}}
          />
        </Link>
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                darkItemSelectedBg: "bg-black",
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
            style={{flex: 1, minWidth: 0}}
            className="font-MGPText text-lg font-medium bg-black"
          />
        </ConfigProvider>

        <div className={"text-[#e5e7eb] flex items-center"}>
          {loggedInUser ? (
            <>
              <Button type="link" onClick={handleLogout} className="!text-white hover:!text-red-400 px-3">
                Logout
              </Button>
              <Link to={'/profile'}
                    className={"px-3 font-bold"}>Welcome, {loggedInUser.name || loggedInUser.nickname || 'Rider'}</Link>
            </>
          ) : (
            <>
              <Link to="/login" className={"px-3 hover:text-white"}>Login</Link>
              <Link to="/register" className={"px-3 hover:text-white"}>Register</Link>
            </>
          )}
          <Link to={"/admin"}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="MGP Icons/Helmet Line">
                <path id="Vector"
                      d="M33.7589 24.0529L33.7022 23.7711C32.6763 18.6563 32.161 16.0897 32.1563 16.0715C31.583 13.7718 30.316 11.8348 28.4926 10.47C26.8026 9.2048 24.6767 8.49109 22.5067 8.46072C19.8759 8.42369 17.3919 8.97887 15.1237 10.1104C13.3152 11.0126 11.6434 12.28 10.1548 13.8774C7.63188 16.5848 6.51484 19.2863 6.46854 19.4L6.17188 20.1285L10.2211 21.4666L11.5893 25.3048L32.3063 31.5059L33.733 25.5092C33.8474 25.0278 33.8563 24.5381 33.7589 24.0533V24.0529ZM32.3034 25.1685L31.2371 29.6507L12.7241 24.1096L11.9897 22.05L15.2522 23.1278L15.7134 21.7322L11.3645 20.2963L8.16817 19.24C8.64521 18.3055 9.63965 16.5866 11.2304 14.8792C12.5985 13.4111 14.1293 12.2489 15.7804 11.4255C17.8367 10.3996 20.0926 9.89628 22.4867 9.93035C24.3489 9.95665 26.1693 10.5659 27.6122 11.6466C28.8834 12.5981 29.8371 13.8815 30.4104 15.4L19.7208 14.2581C19.5652 14.2415 19.4226 14.24 19.2845 14.2541C18.6074 14.3222 18.0493 14.6974 17.7526 15.2833C17.4322 15.9163 17.4663 16.7063 17.8415 17.3474L20.0119 21.2011C20.8804 22.7433 22.3667 23.8592 24.09 24.2633L30.9497 25.8715L31.2852 24.4404L24.4256 22.8322C23.1019 22.5218 21.96 21.6644 21.293 20.48L19.1193 16.6204L19.1119 16.6078C18.9871 16.3963 18.9685 16.137 19.0645 15.9478C19.1341 15.8104 19.2545 15.7348 19.4322 15.717C19.4674 15.7133 19.5122 15.7144 19.5652 15.72L30.8304 16.9233C31.1189 18.3604 31.9222 22.3648 32.2626 24.0607L32.3193 24.3426C32.3745 24.6178 32.3697 24.8959 32.3045 25.1692L32.3034 25.1685Z"
                      fill="white"></path>
              </g>
            </svg>
          </Link>
        </div>
      </Header>
      <Content>
        <Outlet/>
      </Content>
      <Footer className={"py-4 border-t font-MGPText text-lg"} style={{margin: 0, padding: 0, background: "#FAFCFF"}}>
        <div className={"border-b p-6"}>
          <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1174.72 188"
            className={"w-[200px] h-8 mx-auto"}
          >
            <path
              d="M624.48,29.57h37.41v45h-37.35l.08,61.32c0,2.2,1.78,3.98,3.98,3.98h33.3v45h-33.55c-27.49,0-49.77-22.46-49.77-49.95V0h45.87l.04,29.57ZM484.63,21.58c-45.95,0-83.21,37.25-83.21,83.21s37.25,83.21,83.21,83.21,83.21-37.25,83.21-83.21-37.25-83.21-83.21-83.21ZM484.63,143.54c-20.65,0-37.4-18.09-37.4-38.74s16.74-38.74,37.4-38.74,37.4,18.09,37.4,38.74-16.74,38.74-37.4,38.74ZM748.88,21.58c-45.95,0-83.21,37.25-83.21,83.21s37.25,83.21,83.21,83.21,83.21-37.25,83.21-83.21-37.25-83.21-83.21-83.21ZM748.88,143.54c-20.65,0-37.4-18.09-37.4-38.74s16.74-38.74,37.4-38.74,37.4,18.09,37.4,38.74-16.74,38.74-37.4,38.74ZM366.68,17.47c-17.54-9.12-38.8-5.59-52.3,8.36l-89.14,98.86c-1.83,1.9-5.05.61-5.05-2.03V57c0-24.61-19.88-44.57-44.49-44.57-12.36,0-24.99,4.93-32.51,13.26L0,184.89h66.04l99.68-110.8c1.83-1.9,5.04-.6,5.04,2.04v66.74c0,18.62,11.55,35.08,29.24,41.35,16.61,5.89,36.2.81,48.07-11.99l88.16-97.84c1.83-1.9,5.04-.6,5.04,2.04v108.46h49.43V57.01c0-16.52-9.15-31.82-24.02-39.54h0ZM1114.52,12.45h-183.71c-47.54,0-86.22,38.68-86.22,86.22s38.68,86.22,86.22,86.22h144.11v-51.79h42.05c32.07-1.29,57.75-27.95,57.75-60.33s-27.01-60.33-60.2-60.33ZM1005.84,64.24h-75.03c-18.99,0-34.43,15.45-34.43,34.43s15.45,34.43,34.43,34.43h40.22v-17.08h-40.22c-9.57,0-17.36-7.79-17.36-17.36s7.79-17.36,17.36-17.36h75.03v86.5h-75.03c-38.13,0-69.15-31.02-69.15-69.15s31.02-69.15,69.14-69.15h75.04s0,34.71,0,34.71ZM1114.51,116.03h-56.68v51.79h-34.92v-86.5h91.6c4.72,0,8.54-3.82,8.54-8.54s-3.82-8.54-8.54-8.54h-91.6V29.52h91.6c23.78,0,43.13,19.47,43.13,43.25s-19.35,43.25-43.13,43.25ZM1096.18,184.89h3.15v-14.05h5.39v-3.02h-13.9v3.02h5.36v14.05ZM1107.89,184.89h3.12v-11.88l3.88,6.51h2.56l3.9-6.66v12.02h3.12v-17.07h-3.29l-4.97,8.41-5.02-8.41h-3.29v17.07h0Z"/>
          </svg>
        </div>
        <div className={"p-2 flex flex-col items-center border-b"}>
          <h6 className={"text-neutral-400"}>Official Sponsors</h6>
          <ul className="flex justify-center gap-20 items-center my-4">
            <li>
              <a href="https://www.qatarairways.com/es-es/homepage.html">
                <img className="w-[60px] h-auto" src={sponsor} alt="logo"/>
              </a>
            </li>
            <li>
              <a href="https://www.tissotwatches.com/en-en">
                <img className="w-[60px] h-auto" src={tissot} alt="logo"/>
              </a>
            </li>
            <li>
              <a href="https://www.michelinmotorsport.com/en/motorsport/">
                <img className="w-[60px] h-auto" src={michelin} alt="logo"/>
              </a>
            </li>
            <li>
              <a href="https://www.bmw-m.com/en/fastlane/motogp.html">
                <img className="w-[60px] h-auto" src={bwm} alt="logo"/>
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
                <img className="w-[60px] h-auto" src={dhl} alt="logo"/>
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
            <h3 className="font-bold mb-4">Game Hub</h3>
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
              Download the Official <br/> MotoGP™ App
            </p>
            <img className="w-[118px] h-auto" src={app_store} alt="logo"/>
            <img className="w-[118px] h-auto" src={play_store} alt="logo"/>
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
