import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import EventService from "../../../services/EventService";
import SessionService from "../../../services/SessionService";
import { getImageUrl } from "../../../utils/urlHelpers";

const formatMonthKey = (date) => dayjs(date).format("YYYY-MM");
const formatMonthLabel = (date) => dayjs(date).format("MMMM").toUpperCase();

const useCalendarData = () => {
  const now = new Date();

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

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialView = searchParams.get("view") || "grid";

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

        const futureRaces = raceEvents.filter(e => new Date(e.startDate) >= new Date(upcomingRace?.startDate));
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

  return {
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
  };
};

export default useCalendarData;
