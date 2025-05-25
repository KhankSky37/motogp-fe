import React, {useMemo, useState} from "react";
import {Tabs, ConfigProvider} from "antd";
import dayjs from "dayjs";
import {getImageUrl} from "../../../utils/urlHelpers.jsx";
import "dayjs/locale/en";

// Random images
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
import VideosSecion from "../home/VideosSecion.jsx";
import UpcomingSection from "../home/UpcomingSection.jsx";

const {TabPane} = Tabs;

const getFullSessionType = (shortType) => {
  const map = {
    FP1: "Free Practice Nr. 1",
    FP2: "Free Practice Nr. 2",
    Q1: "Qualifying Nr. 1",
    Q2: "Qualifying Nr. 2",
    PR: "Practice",
    WUP: "Warm Up",
    RAC: "Race",
    GP: "Grand Prix",
    SPR: "Tissot Sprint",
  };
  return map[shortType] || shortType;
};

const sessionDurations = {
  FP1: 30,
  FP2: 30,
  PR: 40,
  Q1: 15,
  Q2: 15,
  SPR: 20,
  WUP: 10,
  GP: 30,
};

// const lapMap = [19, 22, 26, 24, 23];
//
// let lapIndex = 0;

const DetailEvent = ({schedule, event}) => {
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
      {/* Banner */}
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
            <h1 className="text-[40px] font-MGPDisplay uppercase mt-6 mb-4">{event.name}</h1>
            <p className="text-xl mt-1 font-medium font-MGPText text-colorText">{event.officialName}</p>
          </div>
          <div className="flex items-center gap-4 mt-2 font-MGPText text-colorText">
            <img
              src={getImageUrl(event.circuit.imageUrl)}
              alt="circuit"
              className="w-[60px] h-[60px]"
            />
            <p className="text-lg">{event.circuit.name}</p>
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

      {/* Tabs */}
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
              tabBarStyle={{fontWeight: "bold", fontSize: 16}}
              items={[
                {key: "overview", label: <span className="font-MGPText font-bold uppercase text-lg">Overview</span>},
                {key: "starting-grid", label: <span className="font-MGPText font-semibold uppercase text-lg">Starting Grid</span>},
                {key: "entry-list", label: <span className="font-MGPText font-semibold uppercase text-lg">Entry List</span>},
                {key: "circuit-info", label: <span className="font-MGPText font-semibold uppercase text-lg">Circuit Info</span>},
                {key: "destination-guide", label: <span className="font-MGPText font-semibold uppercase text-lg">Destination Guide</span>},
              ]}
            />
          </ConfigProvider>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white text-black px-4 sm:px-12 py-8">
        <div className="text-[40px] font-MGPDisplay font-bold">Schedule</div>
        {activeKey === "overview" && (
          <ConfigProvider
            theme={{
              components: {
                Tabs: {
                  itemColor: "#000000",
                  itemSelectedColor: "#000000",
                  itemHoverColor: "#000000",
                  inkBarColor: "#000000",
                },
              },
            }}
          >
            <Tabs
              defaultActiveKey={days[0]}
              tabBarGutter={40}
              className="custom-tabs mt-4 font-MGPDisplay"
              tabBarStyle={{fontSize: 16}}
            >
              {days.map((date) => (
                <TabPane
                  key={date}
                  tab={
                    <div>
                      <div className="text-[32px] font-bold">{dayjs(date).format("D")}</div>
                      <div className="text-sm uppercase font-MGPText font-bold">{dayjs(date).format("dddd")}</div>
                    </div>
                  }
                >
                  <div className="mt-4">
                    {schedule[date].length === 0 ? (
                      <div className="text-colorText italic">No sessions</div>
                    ) : (
                      schedule[date].map((session) => {
                        const start = dayjs(session.sessionDatetime);
                        const duration = sessionDurations[session.sessionType] || 0;
                        const isRace = session.sessionType === "RAC";
                        const end = start.add(duration, "minute");

                        return (
                          <div
                            key={session.id}
                            className="grid [grid-template-columns:220px_90px_300px_1fr_auto] font-MGPText items-center border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition h-[86px] overflow-hidden gap-12"
                          >
                            <div className="relative h-full flex flex-col justify-center">
                              <div className="absolute inset-0 z-0">
                                <div
                                  className="flex flex-col justify-center finished-label w-full h-full pl-[30px] text-white text-xs font-extrabold">
                                  <div className="font-medium text-white text-lg ml-2">
                                    {start.format("HH:mm")}
                                    {!isRace && duration > 0 && ` – ${end.format("HH:mm")}`}
                                  </div>
                                  <div className="text-sm font-MGPDisplay font-bold">
                                    <span className="text-lg">🏁 </span>
                                    FINISHED
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-start text-gray-600 font-medium font-MGPText text-xl">
                              {session.category.name}
                            </div>
                            <div className="text-start text-black px-12 font-bold text-xl">
                              {getFullSessionType(session.sessionType)}
                            </div>
                            <div className="font-MGPText text-gray-600 text-xl font-MGPText font-bold
                            ">
                              {isRace ? `19Laps` : ""}
                            </div>
                            <div className="flex justify-center space-x-2 mr-12">
                              <button
                                className="border border-gray-400 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200">
                                RESULTS
                              </button>
                              <button
                                className="border border-gray-400 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200">
                                REPLAY
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </TabPane>
              ))}
            </Tabs>
          </ConfigProvider>
        )}

        {activeKey === "starting-grid" && <div className="p-6 text-gray-700 italic">Starting Grid content goes here.</div>}
        {activeKey === "entry-list" && <div className="p-6 text-gray-700 italic">Entry List content goes here.</div>}
        {activeKey === "circuit-info" && <div className="p-6 text-gray-700 italic">Circuit Info content goes here.</div>}
        {activeKey === "destination-guide" && <div className="p-6 text-gray-700 italic">Destination Guide content goes here.</div>}
      </div>

      <style jsx>{`
        .finished-label {
          background-color: #171c21;
          clip-path: polygon(0 0, 100% 0, 80% 100%, 0% 100%);
        }
      `}</style>

      <VideosSecion/>

      <UpcomingSection/>

      <div className="text-center bg-[#171C21] text-white p-6 m-12">
        <h1 className="text-[32px] font-MGPDisplay font-bold mb-4">Get the official MotoGP™ Newsletter!</h1>
        <p className="font-MGPText font-light text-lg px-16 mb-4">Create a MotoGP™ account now and gain access to exclusive content, such as the MotoGP™ Newsletter, which features GP Reports, incredible videos and other interesting information about our sport.</p>
        <button className="px-4 py-2 text-sm font-bold bg-white uppercase font-MGPText text-black rounded-full">
          sign up for free
        </button>
      </div>
    </>
  );
};

export default DetailEvent;
