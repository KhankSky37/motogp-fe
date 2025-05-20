import React from "react";
import { Tabs } from "antd";
import dayjs from "dayjs";

const { TabPane } = Tabs;

const ScheduleTabs = ({ schedule }) => {
  const days = Object.keys(schedule);

  return (
    <div className="bg-white p-12">
      <Tabs
        defaultActiveKey={days[0]}
        tabBarGutter={40}
        className="custom-tabs"
        tabBarStyle={{
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        {days.map((date) => (
          <TabPane
            key={date}
            tab={
              <div className="text-center leading-tight">
                <div className="text-lg font-bold">{dayjs(date).format("D")}</div>
                <div className="text-sm capitalize">{dayjs(date).format("dddd")}</div>
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
                    {/* Column 1: FINISHED label & time */}
                    <div className="relative h-full flex flex-col justify-center">
                      {/* FINISHED label - nằm bên dưới */}
                      <div className="absolute inset-0 z-0">
                        <div className="flex flex-col justify-center finished-label w-full h-full pl-[60px] text-white text-xs font-extrabold">
                          <div className="font-bold text-white">
                            {dayjs(session.sessionDatetime).format("HH:mm")}
                          </div>
                          <div>PINISHED</div>
                        </div>
                      </div>

                      {/* Time - nằm bên trên */}
                    </div>

                    {/* Column 2: Category */}
                    <div className="text-start text-gray-700 font-medium">
                      {session.category.categoryId}
                    </div>

                    {/* Column 3: Session Type */}
                    <div className="text-start text-gray-700 font-medium px-12">
                      {session.sessionType}
                    </div>

                    {/* Column 4: Empty */}
                    <div></div>

                    {/* Column 5: Action Buttons */}
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

      <style jsx>{`
          .finished-label {
              background-color: #171c21;
              clip-path: polygon(0 0, 100% 0, 80% 100%, 0% 100%);
          }
      `}</style>
    </div>
  );
};

export default ScheduleTabs;
