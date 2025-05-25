// src/components/user/Calendar/Calendar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import dayjs from "dayjs";
import EventService from "../../../services/EventService";
import SessionService from "../../../services/SessionService";
import { getImageUrl } from "../../../utils/urlHelpers";
import GPGridView from "../../../components/user/Calendar/GPGridView.jsx";
import GPListViewResults from "../../../components/user/Calendar/GPListViewResults.jsx";
import GPListViewUP from "../../../components/user/Calendar/GPListViewUP.jsx";
import TestView from "../../../components/user/Calendar/TestView.jsx";
import CalendarNavTabs from "../../../components/user/Calendar/CalendarNavTabs.jsx";
import TicketsSection from "../../../components/user/home/TicketsSection.jsx";
import NewsSection from "../../../components/user/home/NewsSection.jsx";

const formatMonthKey = (date) => dayjs(date).format("YYYY-MM");
const formatMonthLabel = (date) => dayjs(date).format("MMMM").toUpperCase();

const Calendar = () => {
  const now = new Date();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialView = searchParams.get("view") || "grid";

  const [allEvents, setAllEvents] = useState([]);
  const [raceResults, setRaceResults] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingResults, setLoadingResults] = useState(true);
  const [upNextRaceId, setUpNextRaceId] = useState(null);
  const [upNextTestId, setUpNextTestId] = useState(null);
  const [raceByMonth, setRaceByMonth] = useState({});
  const [testByMonth, setTestByMonth] = useState({});
  const [gridRaces, setGridRaces] = useState([]);
  const [upNextRace, setUpNextRace] = useState(null);
  const [activeTab, setActiveTab] = useState("gps");
  const [viewMode, setViewMode] = useState(initialView);

  const handleViewChange = (mode) => {
    setViewMode(mode);
    const params = new URLSearchParams(location.search);
    params.set("view", mode);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const onChangeTab = (key) => {
    setActiveTab(key);
  };

  useEffect(() => {
    EventService.getAllEvents()
      .then((response) => {
        const events = response.data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        setAllEvents(events);

        const raceEvents = events.filter((e) => e.eventType === "RACE");
        const upcomingRace = raceEvents.find((e) => new Date(e.startDate) > now);
        setGridRaces(raceEvents);
        setUpNextRace(upcomingRace);

        const futureRaces = raceEvents.filter((e) => new Date(e.startDate) >= new Date(upcomingRace?.startDate));
        const groupedRace = {};
        futureRaces.forEach((e) => {
          const key = formatMonthKey(e.startDate);
          if (!groupedRace[key]) groupedRace[key] = [];
          groupedRace[key].push(e);
        });
        Object.values(groupedRace).forEach(month => month.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));
        setRaceByMonth(groupedRace);
        setUpNextRaceId(upcomingRace?.id);

        const testEvents = events.filter((e) => e.eventType === "TEST");
        const upcomingTest = testEvents.find((e) => new Date(e.startDate) > now);
        const groupedTest = {};
        testEvents.forEach((e) => {
          const key = formatMonthKey(e.startDate);
          if (!groupedTest[key]) groupedTest[key] = {
            label: formatMonthLabel(e.startDate),
            events: [],
          };
          groupedTest[key].events.push(e);
        });
        Object.values(groupedTest).forEach(month => month.events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));
        setTestByMonth(groupedTest);
        setUpNextTestId(upcomingTest?.id);

        setLoadingEvents(false);
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
        setLoadingEvents(false);
      });
  }, []);

  useEffect(() => {
    SessionService.getAllSessions()
      .then((res) => {
        const sessions = res.data;
        const eventMap = {};

        sessions.forEach((session) => {
          if (
            session.sessionType === "RACE" &&
            session.category.categoryId === "MotoGP™" &&
            Array.isArray(session.results)
          ) {
            const event = session.event;
            if (!event?.name || !event?.startDate) return;

            const top3 = session.results
              .filter((r) => r.position && r.position <= 3)
              .map((r) => ({
                name: `${r.rider.firstName} ${r.rider.lastName}`,
                photoUrl: getImageUrl(r.rider?.photoUrl),
                rank: r.position,
              }))
              .sort((a, b) => a.rank - b.rank);

            if (!eventMap[event.name]) {
              eventMap[event.name] = {
                riders: top3,
                startDate: event.startDate,
                endDate: event.endDate,
                officialName: event.officialName,
              };
            }
          }
        });

        const results = Object.entries(eventMap)
          .map(([eventName, data]) => ({
            eventName,
            officialName: data.officialName,
            startDate: data.startDate,
            endDate: data.endDate,
            riders: data.riders,
          }))
          .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

        setRaceResults(results);
        setLoadingResults(false);
      })
      .catch((err) => {
        console.error("Failed to fetch sessions:", err);
        setLoadingResults(false);
      });
  }, []);

  const combinedByMonth = {};
  if (!loadingEvents && !loadingResults) {
    raceResults.forEach((race) => {
      const key = formatMonthKey(race.endDate);
      if (!combinedByMonth[key]) {
        combinedByMonth[key] = {
          label: formatMonthLabel(race.endDate),
          races: [],
          events: [],
        };
      }
      combinedByMonth[key].races.push(race);
    });

    Object.entries(raceByMonth).forEach(([key, events]) => {
      if (!combinedByMonth[key]) {
        combinedByMonth[key] = {
          label: formatMonthLabel(events[0].startDate),
          races: [],
          events: [],
        };
      }
      combinedByMonth[key].events.push(...events);
    });
  }

  const sortedMonthKeys = Object.keys(combinedByMonth).sort(
    (a, b) => new Date(`${a}-01`) - new Date(`${b}-01`)
  );

  let globalIndex = 0;
  let testGlobalIndex = 0

  return (
    <div className="text-white min-h-screen bg-white">
      <CalendarNavTabs activeTab={activeTab} onChangeTab={onChangeTab} />

      <div className="bg-[#F4F4F4] px-12 py-6 text-black">
        {activeTab === "gps" ? (
          <div className="flex flex-col gap-6">
            <div className="flex space-x-2 mb-4 font-MGPText font-bold text-sm ">
              <button
                onClick={() => handleViewChange("grid")}
                className={`px-6 py-2 rounded-full uppercase transition ${
                  viewMode === "grid"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => handleViewChange("list")}
                className={`px-6 py-2 rounded-full uppercase transition ${
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
                    <div className="text-base font-bold font-MGPDisplay">{month.label}</div>
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
                <div className="text-base font-bold font-MGPDisplay mt-4">{label}</div>
                <div className="grid grid-cols-1 gap-2">
                  {events.map((event) => {
                    const index = testGlobalIndex++;
                    return (
                      <TestView
                        key={event.id}
                        event={event}
                        index={index}
                        isUpNext={event.id === upNextTestId}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

      </div>

      <div className="bg-[#F4F4F4] text-black">
        <TicketsSection />

        <NewsSection />
      </div>
    </div>
  );
};

export default Calendar;
