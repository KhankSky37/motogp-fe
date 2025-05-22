import React from "react";
import { ConfigProvider, Tabs } from "antd";

const CalendarNavTabs = ({ activeTab, onChangeTab }) => {

  return (
    <div className="bg-gradient-to-b from-black to-[#1a0000]">
      <div className="flex justify-between items-center h-24 px-12">
        <h1 className="text-[40px] font-MGPDisplay font-bold tracking-wide uppercase">
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
              { key: "gps", label: <span className="text-[18px]">GPs</span> },
              { key: "tests", label: <span className="text-[18px]">Tests</span> },
            ]}
            tabBarGutter={40}
            animated={{ inkBar: true }}
            className="riders-tabs font-MGPText font-bold"
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

export default CalendarNavTabs;
