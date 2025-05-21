import React from "react";
import { ConfigProvider, Tabs } from "antd";

const CalendarTabs = ({ activeTab, onChangeTab }) => {

  return (
    <div className="bg-gradient-to-b from-black to-[#1a0000]">
      <div className="flex justify-between items-center h-24 px-12">
        <h1 className="text-4xl font-extrabold tracking-wide uppercase">
          2025 Calendar
        </h1>
        <div className="text-white text-xl">
          <i className="ri-search-line" />
        </div>
      </div>

      <div className="px-6">
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                itemColor: "#9ca3af",
                itemHoverColor: "#ffffff",
                itemSelectedColor: "#ffffff",
                inkBarColor: "#ffffff",
                horizontalItemPadding: "16px 24px",
              },
            },
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={onChangeTab}
            items={[
              { key: "gps", label: "GPs" },
              { key: "tests", label: "Tests" },
            ]}
            tabBarGutter={40}
            animated={{ inkBar: true }}
            className="riders-tabs uppercase font-semibold text-sm"
            tabBarStyle={{
              borderBottom: "1px solid #374151",
              height: 56,
            }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default CalendarTabs;
