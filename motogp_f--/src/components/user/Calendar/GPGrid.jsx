import React, { useEffect, useState } from "react";
import EventService from "../../../services/EventService.jsx";
import GPGridCard from "./GPGridCard.jsx";
import TestCard from "./TestCard.jsx";
import {Link} from "react-router-dom";

const GPGrid = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    EventService.getAllEvents()
      .then((response) => {
        const sortedEvents = response.data.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );
        setEvents(sortedEvents);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch events:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  const now = new Date();

  // ✅ Lọc các event là RACE
  const raceEvents = events.filter((e) => e.eventType === "RACE");

  // ✅ Tìm event sắp diễn ra (UP NEXT)
  const upcomingRaceEvents = raceEvents.filter((e) => new Date(e.startDate) > now);
  const upNextEvent = upcomingRaceEvents.length > 0 ? upcomingRaceEvents[0] : null;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {raceEvents.map((event, index) => (
          <Link to={`/calendar/${event.name}/${event.id}`}>
            <GPGridCard
              key={event.id}
              event={event}
              index={index}
              isUpNext={upNextEvent && event.id === upNextEvent.id}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GPGrid;
