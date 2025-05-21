import React, { useEffect, useState } from 'react';
import DetailEvent from "../../../components/user/Calendar/DetailEvent.jsx";
import { useParams } from "react-router-dom";
import EventService from "../../../services/EventService.jsx";
import dayjs from "dayjs";

const CalendarDetail = () => {
  const { eventId } = useParams();
  const [groupedSessions, setGroupedSessions] = useState({});
  const [event, setEvent] = useState(null); // Thêm state để lưu event
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await EventService.getEventById(eventId);
        const eventData = response.data;
        const { startDate, endDate, sessions } = eventData;

        setEvent(eventData); // Lưu event vào state

        const start = dayjs(startDate);
        const end = dayjs(endDate);
        const sessionMap = {};

        // Tạo danh sách ngày từ start đến end
        for (
          let date = start;
          date.isBefore(end) || date.isSame(end, 'day');
          date = date.add(1, 'day')
        ) {
          const formatted = date.format("YYYY-MM-DD");
          sessionMap[formatted] = [];
        }

        // Gán session vào ngày tương ứng nếu có
        sessions.forEach(session => {
          const sessionDate = dayjs(session.sessionDatetime).format("YYYY-MM-DD");
          if (sessionMap[sessionDate]) {
            sessionMap[sessionDate].push(session);
          }
        });

        setGroupedSessions(sessionMap);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!event) return <div className="p-12 text-center text-red-500">Event not found</div>;

  return (
    <div>
      <DetailEvent schedule={groupedSessions} event={event} />
    </div>
  );
};
// đây là user/calendar/calendarDetail
export default CalendarDetail;
