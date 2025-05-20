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
            <div className="mt-4 space-y-4">
              {schedule[date].length === 0 ? (
                <div className="text-gray-500 italic">No sessions</div>
              ) : (
                schedule[date].map((session) => (
                  <div
                    key={session.id}
                    className="relative flex justify-between items-center border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition h-[86px]"
                  >
                    {/* FINISHED label */}
                    <div className="absolute left-0 top-0 h-full">
                      <div className="finished-label w-[230px] h-full flex items-center pl-[60px] text-white text-xs font-extrabold">
                        FINISHED
                      </div>
                    </div>

                    <div className="text-gray-700 font-medium">
                      <div>
                        🕒 <b>{dayjs(session.sessionDatetime).format("HH:mm")}</b>
                      </div>
                      <div>
                        🏁 <b>{session.category.categoryId}</b>
                      </div>
                      <div>
                        📌 <b>{session.sessionType}</b>
                      </div>
                    </div>

                    <div className="space-x-2">
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
