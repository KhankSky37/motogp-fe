import React from "react";
import { Link } from "react-router-dom";
import GPGridView from "../../../components/user/Calendar/GPGridView.jsx";
import GPListViewResults from "../../../components/user/Calendar/GPListViewResults.jsx";
import GPListViewUP from "../../../components/user/Calendar/GPListViewUP.jsx";
import TestView from "../../../components/user/Calendar/TestView.jsx";
import CalendarTabs from "./CalendarTabs";
import useCalendarData from "./useCalendarData";

const Calendar = () => {
  const {
    viewMode,
    handleViewChange,
    activeTab,
    onChangeTab,
    upNextRace,
    upNextRaceId,
    upNextTestId,
    gridRaces,
    loadingEvents,
    loadingResults,
    sortedMonthKeys,
    combinedByMonth,
    testByMonth,
  } = useCalendarData();

  let globalIndex = 0;

  return (
    <div className="text-white min-h-screen bg-white">
      <CalendarTabs activeTab={activeTab} onChangeTab={onChangeTab} />

      <div className="bg-[#F4F4F4] px-12 py-6 text-black">
        {activeTab === "gps" ? (
          <div className="flex flex-col gap-6">
            {/* View mode toggle */}
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

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {gridRaces.map((event, index) => (
                  <Link to={`/calendar/${event.name}/${event.id}`} key={event.id}>
                    <GPGridView
                      event={event}
                      index={index}
                      isUpNext={upNextRace && event.id === upNextRace.id}
                    />
                  </Link>
                ))}
              </div>
            ) : loadingEvents || loadingResults ? (
              <div>Loading...</div>
            ) : (
              sortedMonthKeys.map((monthKey) => {
                const month = combinedByMonth[monthKey];
                const allItems = [
                  ...month.races.map((r) => ({ type: "race", data: r })),
                  ...month.events.map((e) => ({ type: "event", data: e })),
                ].sort((a, b) => new Date(a.data.startDate || a.data.endDate) - new Date(b.data.startDate || b.data.endDate));

                return (
                  <div key={monthKey} className="flex flex-col gap-4">
                    <div className="text-2xl font-bold mb-[-12px]">{month.label}</div>
                    {allItems.map((item) => {
                      const idx = globalIndex++;
                      if (item.type === "race") {
                        const { eventName, officialName, startDate, endDate, riders } = item.data;
                        return (
                          <GPListViewResults
                            key={`race-${eventName}-${idx}`}
                            index={idx}
                            eventName={eventName}
                            officialName={officialName}
                            startDate={startDate}
                            endDate={endDate}
                            riders={riders}
                          />
                        );
                      } else {
                        return (
                          <GPListViewUP
                            key={`event-${item.data.id}`}
                            event={item.data}
                            index={idx}
                            isUpNext={item.data.id === upNextRaceId}
                          />
                        );
                      }
                    })}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          Object.keys(testByMonth).map((monthKey) => {
            const { label, events } = testByMonth[monthKey];
            return (
              <div key={monthKey} className="flex flex-col gap-4">
                <div className="text-2xl font-bold mb-[-12px]">{label}</div>
                <div className="grid grid-cols-1 gap-2">
                  {events.map((event, idx) => (
                    <TestView
                      key={event.id}
                      event={event}
                      index={idx}
                      isUpNext={event.id === upNextTestId}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Calendar;
