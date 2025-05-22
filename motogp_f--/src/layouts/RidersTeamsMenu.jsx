import React, { useEffect, useState } from "react";
import { Tabs, ConfigProvider } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
    { label: "Riders", path: "/riders" },
    { label: "Team", path: "/teams" },
];

const RidersTeamsMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const activeKey =
        menuItems.find((item) => location.pathname.includes(item.path))?.path ||
        "/riders";

    // State local giữ active tab để tránh unmount nhanh khi đổi route
    const [localActiveKey, setLocalActiveKey] = useState(activeKey);

    // Đồng bộ state local khi location thay đổi (ví dụ chuyển route ngoài)
    useEffect(() => {
        setLocalActiveKey(activeKey);
    }, [activeKey]);

    useEffect(() => {
        // Inject style cho inkBar chuyển động chậm
        const style = document.createElement("style");
        style.innerHTML = `
          .riders-tabs .ant-tabs-ink-bar {
            transition-duration: 0.7s !important;
          }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Khi đổi tab, cập nhật state local rồi delay mới navigate
    const onChange = (key) => {
        setLocalActiveKey(key);
        setTimeout(() => {
            navigate(key);
        }, 300); // Trùng thời gian với transition inkBar
    };

    return (
        <div className="bg-gradient-to-b from-black to-[#1a0000] text-white px-12 font-MGPDisplay">
            <div className="flex justify-between items-center h-24">
                <h1 className="text-[40px] font-extrabold tracking-wide uppercase">
                    Riders & Teams
                </h1>
                <div className="text-white text-xl">
                    <i className="ri-search-line" />
                </div>
            </div>

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
                    activeKey={localActiveKey}
                    onChange={onChange}
                    items={menuItems.map((item) => ({
                        key: item.path,
                        label: <span className="font-semibold text-xl font-MGPText">{item.label}</span>,
                    }))}
                    tabBarGutter={40}
                    animated={{ inkBar: true }}
                    className="riders-tabs uppercase font-MGPText font-bold"
                    tabBarStyle={{
                        borderBottom: "1px solid #374151",
                        height: 56,
                        transition: "all 0.5s ease-in-out",
                    }}
                />
            </ConfigProvider>
        </div>
    );
};

export default RidersTeamsMenu;
