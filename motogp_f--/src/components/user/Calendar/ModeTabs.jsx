import React, { useState, useEffect } from "react";
import { Tabs, ConfigProvider } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import GPGrid from "./GPGrid.jsx";
import GPListAllEvents from "./GPListAllEvents.jsx";
import Test from "./Test.jsx";

const ModeTabs = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialView = searchParams.get("view") || "grid";

    const [activeTab, setActiveTab] = useState("gps");
    const [viewMode, setViewMode] = useState(initialView);

    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
            .riders-tabs .ant-tabs-ink-bar {
                transition-duration: 0.7s !important;
                background: white !important;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const handleViewChange = (mode) => {
        setViewMode(mode);
        const params = new URLSearchParams(location.search);
        params.set("view", mode);
        navigate(`${location.pathname}?${params.toString()}`);
    };

    const onChange = (key) => {
        setActiveTab(key);
    };

    const renderGPsContent = () => (
        <div className="flex flex-col gap-6">
            {/* Nút chọn chế độ xem */}
            <div className="flex space-x-2 mb-4">
                <button
                    onClick={() => handleViewChange("grid")}
                    className={`px-6 py-2 rounded-full font-bold text-xs uppercase transition ${
                        viewMode === "grid"
                            ? "bg-black text-white"
                            : "bg-gray-100 text-black"
                    }`}
                >
                    Grid View
                </button>
                <button
                    onClick={() => handleViewChange("list")}
                    className={`px-6 py-2 rounded-full font-bold text-xs uppercase transition ${
                        viewMode === "list"
                            ? "bg-black text-white"
                            : "bg-gray-100 text-black"
                    }`}
                >
                    List View
                </button>
            </div>

            {/* Hiển thị danh sách GP tương ứng */}
            {viewMode === "grid" ? <GPGrid /> : <GPListAllEvents />}
        </div>
    );

    const renderTestsContent = () => (
        <div className="text-black py-6">
            <Test />
        </div>
    );

    return (
        <div className="text-white min-h-screen bg-white">
            {/* Header có nền gradient riêng */}
            <div className="bg-gradient-to-b from-black to-[#1a0000]">
                <div className="flex justify-between items-center h-24 px-12">
                    <h1 className="text-4xl font-extrabold tracking-wide uppercase">
                        2025 Calendar
                    </h1>
                    <div className="text-white text-xl">
                        <i className="ri-search-line" />
                    </div>
                </div>

                {/* Tabs nằm trong phần header */}
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
                            onChange={onChange}
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
                                transition: "all 0.5s ease-in-out",
                            }}
                        />
                    </ConfigProvider>
                </div>
            </div>

            {/* Content body riêng, nền trắng */}
            <div className="bg-[#F4F4F4] px-12 py-6 text-black">
                {activeTab === "gps" ? renderGPsContent() : renderTestsContent()}
            </div>
        </div>
    );
};

export default ModeTabs;
