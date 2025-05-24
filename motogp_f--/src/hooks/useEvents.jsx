import { useEffect, useState } from "react";
import EventService from "../services/EventService";

export const useEvents = (params = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await EventService.getAllEvents(params);
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [JSON.stringify(params)]); // đảm bảo hook chạy lại khi params thay đổi

  return { events, loading };
};
