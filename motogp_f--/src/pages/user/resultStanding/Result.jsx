import React, {useEffect, useState} from "react";
import {Form, message,} from "antd";
import SeasonService from "../../../services/SeasonService.jsx";
import EventService from "../../../services/EventService.jsx";
import SessionService from "../../../services/SessionService.jsx";
import SearchForm from "../../../components/user/result/SearchForm.jsx";
import EventBanner from "../../../components/user/result/EventBanner.jsx";
import ResultsTable from "../../../components/user/result/ResultsTable.jsx";
import PDFResultsTable from "../../../components/user/result/PDFResultsTable.jsx";

const Result = () => {
  const [form] = Form.useForm();
  const [seasonYears, setSeasonYears] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [sessionData, setSessionData] = useState([]);
  const [loading, setLoading] = useState(false);

  const watchedCategory = Form.useWatch("category", form);
  const watchedSession = Form.useWatch("session", form);

  const watchedEventId = Form.useWatch("event", form);
  const availableCategories = selectedEventDetails?.categoryIds ? Array.from(selectedEventDetails.categoryIds) : [];
  const availableSessions = selectedEventDetails?.sessionTypes ? Array.from(selectedEventDetails.sessionTypes) : [];

  useEffect(() => {
    const fetchSeasonYears = async () => {
      try {
        const response = await SeasonService.getAllSeasons();
        if (response && response.data) {
          const yearsData = response.data
            .map((season) => String(season.id))
            .sort((a, b) => b.localeCompare(a)); // Sort descending
          setSeasonYears(yearsData);
          if (yearsData.length > 0) {
            form.setFieldsValue({year: yearsData[0]});
          }
        } else {
          setSeasonYears([]);
          message.error("Could not fetch season years.");
        }
      } catch (error) {
        console.error("Failed to fetch season years:", error);
        message.error("Failed to load season years. Please try again.");
        setSeasonYears([]);
      }
    };

    fetchSeasonYears();
  }, []);

  useEffect(() => {
    const fetchEventsAsync = async () => {
      const currentYear = form.getFieldValue("year"); // Hoặc watchedYear từ Form.useWatch('year', form)
      const currentType = form.getFieldValue("type"); // Hoặc watchedType từ Form.useWatch('type', form)

      if (!currentYear) {
        setEventsList([]);
        form.setFieldsValue({event: undefined}); // Reset event field
        return;
      }
      try {
        const queryParams = {seasonId: currentYear};
        if (currentType && currentType !== "ALL") {
          queryParams.eventType = currentType;
        }

        const response = await EventService.getEventSearchOptions(queryParams);
        if (response && response.data) {
          setEventsList(response.data);
          if (response.data.length > 0 && response.data[0]?.id) {
            const currentSelectedEventId = form.getFieldValue("event");
            const isCurrentSelectedEventInNewList = response.data.some(
              (event) => event.id === currentSelectedEventId
            );
            if (!currentSelectedEventId || !isCurrentSelectedEventInNewList) {
              form.setFieldsValue({event: response.data[0].id});
            }
          } else {
            form.setFieldsValue({event: undefined}); // Không có event, reset lựa chọn
          }
        } else {
          setEventsList([]);
          form.setFieldsValue({event: undefined}); // Không có data, reset lựa chọn
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        message.error("Failed to load events. Please try again.");
        setEventsList([]);
        form.setFieldsValue({event: undefined}); // Lỗi, reset lựa chọn
      }
    };
    fetchEventsAsync();
  }, [Form.useWatch("year", form), Form.useWatch("type", form), form]); // Thêm form vào dependencies

  useEffect(() => {
    let eventDetailToSet = null;
    if (watchedEventId && eventsList.length > 0) {
      const foundEvent = eventsList.find(
        (event) => event.id === watchedEventId
      );
      eventDetailToSet = foundEvent || null;
    }
    setSelectedEventDetails(eventDetailToSet);


    if (form) {
      form.setFieldsValue({category: undefined, session: undefined});
      if (eventDetailToSet) {
        const newAvailableCategories = eventDetailToSet.categoryIds ? Array.from(eventDetailToSet.categoryIds) : [];
        const newAvailableSessions = eventDetailToSet.sessionTypes ? Array.from(eventDetailToSet.sessionTypes) : [];
        const defaultFormValues = {};
        if (newAvailableCategories.length > 0) {
          defaultFormValues.category = newAvailableCategories[0]; // Đặt category mặc định là mục đầu tiên
        }
        if (newAvailableSessions.length > 0) {
          defaultFormValues.session = newAvailableSessions[0]; // Đặt session mặc định là mục đầu tiên
        }
        if (Object.keys(defaultFormValues).length > 0) {
          form.setFieldsValue(defaultFormValues);
        }
      }
    }
  }, [watchedEventId, eventsList, form]);

  const fetchSessionResults = async () => {
    const eventId = form.getFieldValue("event");
    const category = form.getFieldValue("category");
    const session = form.getFieldValue("session");

    console.log("Fetching session results with params:", "log")
    setLoading(true);
    try {
      const params = {
        eventId: eventId,
        categoryId: category,
        sessionType: session,
      };

      const response = await SessionService.getAllSessions(params);
      console.log("Session data:", response.data);
      if (response && response.data) {
        setSessionData(response.data);
        message.success("Đã lấy dữ liệu session thành công");
      } else {
        message.error("Không tìm thấy dữ liệu cho session này");
        setSessionData(null);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu session:", error);
      message.error("Không thể lấy dữ liệu session. Vui lòng thử lại.");
      setSessionData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (watchedEventId && watchedCategory && watchedSession) {
      fetchSessionResults();
    }
  }, [watchedEventId, watchedCategory, watchedSession]);


  return (
    <>
      {/*<ResultsHeader/>*/}

      <div className={"px-12 relative bg-[#c80502]"}>
        <div className="absolute inset-0 bg-black opacity-85"></div>
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-l to-black from-transparent"></div>
        <SearchForm
          form={form}
          seasonYears={seasonYears}
          eventsList={eventsList}
          availableCategories={availableCategories}
          availableSessions={availableSessions}
        />
      </div>
      <EventBanner
        selectedEvent={selectedEventDetails}
        fallbackName={eventsList[0]?.officialName}
      />

      <ResultsTable
        loading={loading}
        resultData={sessionData?.[0]?.results}
        sessionType={sessionData?.[0]?.sessionType}
      />

      <PDFResultsTable/>
    </>
  );
};

export default Result;
