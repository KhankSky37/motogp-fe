import React, { useEffect, useState } from "react";
import EventService from "../../../services/EventService.jsx";
import GPGridCard from "./GPGridCard.jsx";

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
    // Lọc các event upcoming (chưa bắt đầu)
    const upcomingEvents = events.filter((e) => new Date(e.startDate) > now);
    // Lấy event UP NEXT gần nhất
    const upNextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

    return (
        <div className="">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {events.map((event, index) => (
                    <GPGridCard
                        key={event.id}
                        event={event}
                        index={index}
                        isUpNext={upNextEvent && event.id === upNextEvent.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default GPGrid;
