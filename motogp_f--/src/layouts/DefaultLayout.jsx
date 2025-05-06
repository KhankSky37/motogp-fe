import React from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import motogp from "../assets/motogp1.jpg";

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
      key: "Riders&Teams",
      label: "Riders & Teams",
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
        <img
          src={motogp}
          alt="MotoGP Logo"
          style={{ height: 40, marginRight: 16, width: 200 }}
        />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items}
          onClick={handleMenuClick}
          style={{ flex: 1, minWidth: 0 }}
          className="text-white font-medium bg-black"
        />

        <div className={"text-[#e5e7eb] divide-x-2"}>
          <span className={"px-2"}>Login</span>
          <span className={"px-2"}>Register</span>
        </div>
      </Header>
      <Content>
        <Outlet />
      </Content>
      <Footer className={"px-12 py-4 border-t"}>
        ©{new Date().getFullYear()} Dorna Sports SL. All rights reserved. All
        trademarks are the property of their respective owners.
      </Footer>
    </Layout>
  );
};
export default DefaultLayout;
