import React, { useMemo, useState } from "react";
import { Tabs, ConfigProvider } from "antd";
import dayjs from "dayjs";
import { getImageUrl } from "../../../utils/urlHelpers.jsx";
import "dayjs/locale/en";

import randomImg01 from "../../../assets/01Thai.jpg";
import randomImg02 from "../../../assets/THAI1.png";
import randomImg03 from "../../../assets/03 Americas.jpg";
import randomImg04 from "../../../assets/04 Qatarnew.png";
import randomImg05 from "../../../assets/12 CZE.png";
import randomImg06 from "../../../assets/13 Austria.png";
import randomImg07 from "../../../assets/14 Hungary.png";
import randomImg08 from "../../../assets/15 Catalunya.png";
import randomImg09 from "../../../assets/16 San Marino.png";
import randomImg10 from "../../../assets/17 Japan.png";
import randomImg11 from "../../../assets/18 Indonesia.png";
import randomImg12 from "../../../assets/19 australia.png";
import randomImg13 from "../../../assets/20malasya.png";
import randomImg14 from "../../../assets/21 Portugal.png";
import randomImg15 from "../../../assets/22 valencia.png";

const { TabPane } = Tabs;

const DetailEvent = ({ schedule, event }) => {
  const days = Object.keys(schedule);
  const [activeKey, setActiveKey] = useState("overview");

  const bgImage = useMemo(() => {
    const images = [
      randomImg01, randomImg02, randomImg03, randomImg04, randomImg05,
      randomImg06, randomImg07, randomImg08, randomImg09, randomImg10,
      randomImg11, randomImg12, randomImg13, randomImg14, randomImg15,
    ];
    const seed = event?.round || event?.name?.length || 0;
    return images[seed % images.length];
  }, [event]);

  return (
    <>
      {/* BACKGROUND + INFO */}
      <div
        className="relative bg-cover bg-center text-white"
        style={{
          backgroundImage: `url(${bgImage})`,
          height: "330px",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        <div className="relative z-10 px-4 sm:px-12 py-12">
          <div className="text-white text-base font-medium">
            <div className="flex items-center gap-4 text-[20px]">
              <img
                src={`https://flagsapi.com/${event.circuit.locationCountry}/flat/32.png`}
                alt="flag"
                className="w-9 h-7 object-cover"
              />
              <div className="text-xl font-light font-MGPDisplay uppercase">
                {dayjs(event.startDate).format("MMM D")} – {dayjs(event.endDate).format("MMM D")}
              </div>
            </div>
            <h1 className="text-5xl font-MGPDisplay uppercase mt-4">{event.name}</h1>
            <p className="text-xl mt-1 font-light">{event.officialName}</p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <img
              src={getImageUrl(event.circuit.imageUrl)}
              alt="circuit"
              className="w-6 h-6"
            />
            <p>{event.circuit.name}</p>
          </div>
          <div className="flex gap-4 mt-6">
            {["Results", "Replays", "Standings"].map((label) => (
              <button
                key={label}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full uppercase shadow-md font-MGPText font-semibold"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN TABS */}
      <div className="relative px-4 sm:px-12 bg-[#c80502]">
        <div className="absolute inset-0 bg-black opacity-85 z-0"></div>
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-l to-black from-transparent z-0"></div>
        <div className="relative z-10">
          <ConfigProvider
            theme={{
              components: {
                Tabs: {
                  itemColor: "#ffffff",
                  itemSelectedColor: "#ffffff",
                  itemHoverColor: "#ffffff",
                  inkBarColor: "#ffffff",
                },
              },
            }}
          >
            <Tabs
              activeKey={activeKey}
              onChange={setActiveKey}
              tabBarGutter={32}
              tabBarStyle={{ fontWeight: "bold", fontSize: 16 }}
              items={[
                {
                  key: "overview",
                  label: <span className="font-MGPText font-semibold text-xl">Overview</span>,
                },
                {
                  key: "starting-grid",
                  label: <span className="font-MGPText font-semibold text-xl">Starting Grid</span>,
                },
                {
                  key: "entry-list",
                  label: <span className="font-MGPText font-semibold text-xl">Entry List</span>,
                },
                {
                  key: "circuit-info",
                  label: <span className="font-MGPText font-semibold text-xl">Circuit Info</span>,
                },
                {
                  key: "destination-guide",
                  label: <span className="font-MGPText font-semibold text-xl">Destination Guide</span>,
                },
              ]}
            />
          </ConfigProvider>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white text-black px-4 sm:px-12 py-8">
        {activeKey === "overview" && (
          <Tabs
            defaultActiveKey={days[0]}
            tabBarGutter={40}
            className="custom-tabs mt-4"
            tabBarStyle={{ fontWeight: "bold", fontSize: 16 }}
          >
            {days.map((date) => (
              <TabPane
                key={date}
                tab={
                  <div className="text-center leading-tight">
                    <div className="text-lg font-bold">
                      {dayjs(date).format("D")}
                    </div>
                    <div className="text-sm capitalize">
                      {dayjs(date).format("dddd")}
                    </div>
                  </div>
                }
              >
                <div className="mt-4">
                  {schedule[date].length === 0 ? (
                    <div className="text-gray-500 italic">No sessions</div>
                  ) : (
                    schedule[date].map((session) => (
                      <div
                        key={session.id}
                        className="grid [grid-template-columns:230px_auto_260px_1fr_auto] items-center border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition h-[86px] overflow-hidden gap-12"
                      >
                        <div className="relative h-full flex flex-col justify-center">
                          <div className="absolute inset-0 z-0">
                            <div className="flex flex-col justify-center finished-label w-full h-full pl-[60px] text-white text-xs font-extrabold">
                              <div className="font-bold text-white">
                                {dayjs(session.sessionDatetime).format("HH:mm")}
                              </div>
                              <div>FINISHED</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-start text-gray-700 font-medium">
                          {session.category.categoryId}
                        </div>
                        <div className="text-start text-gray-700 font-medium px-12">
                          {session.sessionType}
                        </div>
                        <div></div>
                        <div className="flex justify-center space-x-2">
                          <button className="border border-gray-400 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200">
                            RESULTS
                          </button>
                          <button className="border border-gray-400 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200">
                            REPLAY
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabPane>
            ))}
          </Tabs>
        )}

        {activeKey === "starting-grid" && (
          <div className="p-6 text-gray-700 italic">Starting Grid content goes here.</div>
        )}
        {activeKey === "entry-list" && (
          <div className="p-6 text-gray-700 italic">Entry List content goes here.</div>
        )}
        {activeKey === "circuit-info" && (
          <div className="p-6 text-gray-700 italic">Circuit Info content goes here.</div>
        )}
        {activeKey === "destination-guide" && (
          <div className="p-6 text-gray-700 italic">Destination Guide content goes here.</div>
        )}
      </div>

      {/* Custom Style */}
      <style jsx>{`
          .finished-label {
              background-color: #171c21;
              clip-path: polygon(0 0, 100% 0, 80% 100%, 0% 100%);
          }
      `}</style>
    </>
  );
};

export default DetailEvent;
