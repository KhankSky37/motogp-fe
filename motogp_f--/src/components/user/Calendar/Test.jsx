import React, { useEffect, useState } from "react";
import EventService from "../../../services/EventService.jsx";
import TestCard from "./TestCard.jsx";
import dayjs from "dayjs";

const formatMonthKey = (date) => dayjs(date).format("YYYY-MM");
const formatMonthLabel = (date) => dayjs(date).format("MMMM").toUpperCase();

const Test = () => {
  const [events, setEvents] = useState([]);
  const [groupedByMonth, setGroupedByMonth] = useState({});
  const [upNextEventId, setUpNextEventId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    EventService.getAllEvents()
      .then((response) => {
        const now = new Date();
        const testEvents = response.data.filter((e) => e.eventType === "TEST");

        const sortedEvents = testEvents.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );

        // Xác định sự kiện sắp tới nhất
        const upcoming = sortedEvents.find((e) => new Date(e.startDate) > now);
        if (upcoming) setUpNextEventId(upcoming.id);

        // Nhóm theo tháng
        const grouped = {};
        sortedEvents.forEach((event) => {
          const key = formatMonthKey(event.startDate);
          if (!grouped[key]) {
            grouped[key] = {
              label: formatMonthLabel(event.startDate),
              events: [],
            };
          }
          grouped[key].events.push(event);
        });

        setGroupedByMonth(grouped);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch events:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  const sortedMonthKeys = Object.keys(groupedByMonth).sort(
    (a, b) => new Date(`${a}-01`) - new Date(`${b}-01`)
  );

  let globalIndex = 0;

  return (
    <div className="p-6 flex flex-col gap-6">
      {sortedMonthKeys.map((monthKey) => {
        const { label, events } = groupedByMonth[monthKey];

        return (
          <div key={monthKey} className="flex flex-col gap-4">
            <div className="text-2xl font-bold mb-[-12px]">{label}</div>
            <div className="grid grid-cols-1 gap-2">
              {events.map((event) => {
                const isUpNext = event.id === upNextEventId;
                const currentIndex = globalIndex++;
                return (
                  <TestCard
                    key={event.id}
                    event={event}
                    index={currentIndex}
                    isUpNext={isUpNext}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Test;
