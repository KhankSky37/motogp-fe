import React, { useEffect, useState } from "react";
import { Typography } from "antd";
import SessionService from "../../../services/SessionService";
import { getImageUrl } from "../../../utils/urlHelpers.jsx";
import GPListResults from "./GPListResults.jsx";
import dayjs from "dayjs";

const { Text } = Typography;

const formatMonth = (date) => dayjs(date).format("MMMM").toUpperCase();

const GPList = () => {
    const [topRidersByEvent, setTopRidersByEvent] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        SessionService.getAllSessions()
            .then((res) => {
                const sessions = res.data;
                const eventMap = {};

                sessions.forEach((session) => {
                    if (session.sessionType === "RACE" && Array.isArray(session.results)) {
                        const event = session.event;
                        const eventName = event?.name;
                        const eventStartDate = event?.startDate;
                        const eventEndDate = event?.endDate;
                        const officialName = event?.officialName;

                        if (!eventName || !eventStartDate) return;

                        const top3 = session.results
                            .filter((r) => r.position && r.position <= 3)
                            .map((r) => ({
                                name: `${r.rider.firstName} ${r.rider.lastName}`,
                                photoUrl: getImageUrl(r.rider?.photoUrl),
                                rank: r.position,
                            }))
                            .sort((a, b) => a.rank - b.rank);

                        if (!eventMap[eventName]) {
                            eventMap[eventName] = {
                                riders: top3,
                                startDate: eventStartDate,
                                endDate: eventEndDate,
                                officialName: officialName,
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
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch sessions:", err);
                setLoading(false);
            });
    }, []);

    const podiumOrder = (riders) => {
        const byRank = { 1: null, 2: null, 3: null };
        riders.forEach((r) => (byRank[r.rank] = r));
        return [byRank[2], byRank[1], byRank[3]].filter(Boolean);
    };

    let lastMonth = null;

    return (
        <div className="p-6">
            <div className="flex flex-col gap-4">
                {topRidersByEvent.length === 0 && (
                    <Text type="secondary">No top riders found.</Text>
                )}

                {topRidersByEvent.map((eventData, index) => {
                    const currentMonth = formatMonth(eventData.endDate);

                    const showMonthHeader = currentMonth !== lastMonth;
                    lastMonth = currentMonth;

                    return (
                        <React.Fragment key={index}>
                            {showMonthHeader && (
                                <div className="text-2xl font-bold mb-[-12px]">
                                    {currentMonth}
                                </div>
                            )}

                            <GPListResults
                                index={index}
                                eventName={eventData.eventName}
                                officialName={eventData.officialName}
                                startDate={eventData.startDate}
                                endDate={eventData.endDate}
                                riders={eventData.riders}
                            />
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default GPList;
