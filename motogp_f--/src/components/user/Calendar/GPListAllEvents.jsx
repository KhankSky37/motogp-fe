import React, { useEffect, useState } from "react";
import { Typography } from "antd";
import SessionService from "../../../services/SessionService";
import EventService from "../../../services/EventService";
import { getImageUrl } from "../../../utils/urlHelpers.jsx";
import GPListCardResults from "./GPListCardResults.jsx";
import GPListCardUP from "./GPListCardUP.jsx";
import dayjs from "dayjs";

const { Text } = Typography;

const formatMonthKey = (date) => dayjs(date).format("YYYY-MM");
const formatMonthLabel = (date) => dayjs(date).format("MMMM").toUpperCase();

const GPListAllEvents = () => {
  const [topRidersByEvent, setTopRidersByEvent] = useState([]);
  const [eventsByMonth, setEventsByMonth] = useState({});
  const [loadingResults, setLoadingResults] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [upNextEventId, setUpNextEventId] = useState(null);
  const [combinedByMonth, setCombinedByMonth] = useState({});

  // Fetch race results
  useEffect(() => {
    setLoadingResults(true);
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

        const resultArray = Object.entries(eventMap)
          .map(([eventName, data]) => ({
            eventName,
            officialName: data.officialName,
            startDate: data.startDate,
            endDate: data.endDate,
            riders: data.riders,
          }))
          .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

        setTopRidersByEvent(resultArray);
        setLoadingResults(false);
      })
      .catch((err) => {
        console.error("Failed to fetch sessions:", err);
        setLoadingResults(false);
      });
  }, []);

  // Fetch upcoming events (RACE only)
  useEffect(() => {
    EventService.getAllEvents()
      .then((response) => {
        const now = new Date();
        const upcoming = response.data
          .filter(event => new Date(event.startDate) > now)
          .filter(event => event.eventType === "RACE") // ✅ only RACE
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        if (upcoming.length === 0) {
          setEventsByMonth({});
          setLoadingEvents(false);
          return;
        }

        const upNext = upcoming[0];
        setUpNextEventId(upNext.id);

        const filteredEvents = response.data
          .filter(event => event.eventType === "RACE") // ✅ only RACE
          .filter(event => new Date(event.startDate) >= new Date(upNext.startDate));

        const grouped = {};
        filteredEvents.forEach((event) => {
          const key = formatMonthKey(event.startDate);
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(event);
        });

        Object.keys(grouped).forEach(month => {
          grouped[month].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        });

        setEventsByMonth(grouped);
        setLoadingEvents(false);
      })
      .catch((error) => {
        console.error("Failed to fetch events:", error);
        setLoadingEvents(false);
      });
  }, []);

  // Combine race results and upcoming events by month
  useEffect(() => {
    if (loadingResults || loadingEvents) return;

    const combined = {};

    // Races
    topRidersByEvent.forEach((race) => {
      const key = formatMonthKey(race.endDate);
      if (!combined[key]) {
        combined[key] = {
          label: formatMonthLabel(race.endDate),
          races: [],
          events: [],
        };
      }
      combined[key].races.push(race);
    });

    // Events
    Object.entries(eventsByMonth).forEach(([key, events]) => {
      if (!combined[key]) {
        combined[key] = {
          label: formatMonthLabel(events[0].startDate),
          races: [],
          events: [],
        };
      }
      combined[key].events.push(...events);
    });

    setCombinedByMonth(combined);
  }, [topRidersByEvent, eventsByMonth, loadingResults, loadingEvents]);

  const sortedMonthKeys = Object.keys(combinedByMonth).sort(
    (a, b) => new Date(`${a}-01`) - new Date(`${b}-01`)
  );

  let globalIndex = 0; // STT liên tục

  return (
    <div className="p-6 flex flex-col gap-6">
      {(loadingResults || loadingEvents) ? (
        <div>Loading...</div>
      ) : (
        sortedMonthKeys.map((monthKey) => {
          const monthData = combinedByMonth[monthKey];

          const allItems = [
            ...monthData.races.map((race) => ({ type: "race", data: race })),
            ...monthData.events.map((event) => ({ type: "event", data: event })),
          ].sort((a, b) => {
            const dateA = new Date(a.data.startDate || a.data.endDate);
            const dateB = new Date(b.data.startDate || b.data.endDate);
            return dateA - dateB;
          });

          return (
            <div key={monthKey} className="flex flex-col gap-4">
              <div className="text-2xl font-bold mb-[-12px]">{monthData.label}</div>

              {allItems.map((item) => {
                const currentIndex = globalIndex++;

                if (item.type === "race") {
                  const { eventName, officialName, startDate, endDate, riders } = item.data;
                  return (
                    <GPListCardResults
                      key={`race-${eventName}-${currentIndex}`}
                      index={currentIndex}
                      eventName={eventName}
                      officialName={officialName}
                      startDate={startDate}
                      endDate={endDate}
                      riders={riders}
                    />
                  );
                } else {
                  return (
                    <GPListCardUP
                      key={`event-${item.data.id}`}
                      event={item.data}
                      index={currentIndex}
                      isUpNext={item.data.id === upNextEventId}
                    />
                  );
                }
              })}
            </div>
          );
        })
      )}
    </div>
  );
};

export default GPListAllEvents;
