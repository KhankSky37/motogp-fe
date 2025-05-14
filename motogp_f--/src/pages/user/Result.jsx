import React, {useEffect, useState} from "react";
import {Col, ConfigProvider, Form, message, Row, Select, Table, Tabs, theme,} from "antd";
import bgHome from "../../assets/bg_results.png";
import SeasonService from "../../services/SeasonService.jsx";
import EventService from "../../services/EventService.jsx";
import {SunOutlined} from "@ant-design/icons";
import SessionService from "../../services/SessionService.jsx";

const Result = () => {
  const [form] = Form.useForm();
  const [seasonYears, setSeasonYears] = useState([]); // State for fetched years
  const [eventsList, setEventsList] = useState([]); // State for fetched events
  const [selectedEventDetails, setSelectedEventDetails] = useState(null); // State mới cho event được chọn
  const [sessionData, setSessionData] = useState(null); // State mới để lưu kết quả session
  const [loading, setLoading] = useState(false); // State để hiển thị trạng thái loading

  const watchedCategory = Form.useWatch("category", form);
  const watchedSession = Form.useWatch("session", form);

  const watchedEventId = Form.useWatch("event", form);
  const availableCategories = selectedEventDetails?.categoryIds ? Array.from(selectedEventDetails.categoryIds) : [];
  const availableSessions = selectedEventDetails?.sessionTypes ? Array.from(selectedEventDetails.sessionTypes) : [];
  const items = [
    {
      key: "1",
      label: <span className="font-semibold text-lg">RESULTS</span>,
    },
    {
      key: "2",
      label: <span className="font-semibold text-lg">STANDINGS</span>,
    },
    {
      key: "3",
      label: <span className="font-semibold text-lg">RECORDS</span>,
    },
  ];

  const columns = [
    {
      title: "Pos.",
      dataIndex: "position",
      key: "position",
      align: "center",
    },
    {
      title: "Rider",
      dataIndex: "rider",
      key: "rider",
    },
    {
      title: "Team",
      dataIndex: "team",
      key: "team",
    },
    {
      title: "Lead Gap",
      dataIndex: "leadGap",
      key: "leadGap",
      align: "right",
    },
    {
      title: "Prev Gap",
      dataIndex: "prevGap",
      key: "prevGap",
      align: "right",
    },
    {
      title: "Laps",
      dataIndex: "laps",
      key: "laps",
      align: "center",
    },
    {
      title: "Fastest Lap",
      dataIndex: "fastestLap",
      key: "fastestLap",
      align: "center",
    },
  ];

  // const categories = ['Race', 'Qualifying', 'Practice 1', 'Practice 2'];
  // const sessions = ['Full Session', 'Highlights', 'Last 5 Minutes'];

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
            form.setFieldsValue({year: yearsData[0]}); // Set default form value after data is loaded
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
            // Nếu event hiện tại đang được chọn không có trong danh sách mới,
            // hoặc chưa có event nào được chọn, thì chọn event đầu tiên
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

  // useEffect để cập nhật selectedEventDetails khi watchedEventId hoặc eventsList thay đổi
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

    if (!eventId || !category || !session) {
      message.warning("Vui lòng chọn đầy đủ Event, Category và Session");
      return;
    }

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

  // Thêm useEffect mới để tự động lấy dữ liệu khi tất cả các trường đã được chọn
  useEffect(() => {
    if (watchedEventId && watchedCategory && watchedSession) {
      fetchSessionResults();
    }
  }, [watchedEventId, watchedCategory, watchedSession]);


  return (
    <>
      <div className={"px-12 pt-4 pb-10 relative bg-[#c80502]"}>
        <div className="absolute inset-0 bg-black opacity-85"></div>
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-l to-black from-transparent"></div>
        <span className={"relative text-5xl font-extrabold text-white"}>
          RESULTS
        </span>
      </div>
      <div className={"px-12 relative bg-[#c80502]"}>
        <div className="absolute inset-0 bg-black opacity-85"></div>
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-l to-black from-transparent"></div>
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                itemColor: "#ffffff",
                itemSelectedColor: "#ffffff",
                itemHoverColor: "#ffffff",
                inkBarColor: "#ffffff",
              },
            },
          }}
        >
          <Tabs defaultActiveKey="1" items={items} rootClassName={"relative"}/>
          ;
        </ConfigProvider>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
          }}
        >
          <Form form={form} name="motogp_search" layout="vertical">
            <Row gutter={16}>
              <Col md={24} lg={4}>
                <Form.Item name="year">
                  <Select placeholder="Select Year">
                    {seasonYears.map((year) => (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col md={24} lg={4}>
                <Form.Item name="type">
                  <Select placeholder="Select Type" defaultValue={"ALL"}>
                    <Option key="ALL" value="ALL">
                      All Events
                    </Option>
                    <Option key="GRAND_PRIX" value="GRAND_PRIX">
                      Grands Prix
                    </Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col md={24} lg={4}>
                <Form.Item name="event">
                  <Select
                    placeholder="Select Event"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {eventsList.map((event) => (
                      <Option key={event.id} value={event.id}>
                        {event.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col md={24} lg={4}>
                <Form.Item name="category">
                  <Select placeholder="Select Category">
                    {availableCategories.map((category) => (
                      <Option key={category} value={category}>
                        {category}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col md={24} lg={4}>
                <Form.Item name="session">
                  <Select placeholder="Select Session">
                    {availableSessions.map((session) => (
                      <Option key={session} value={session}>
                        {session}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ConfigProvider>
      </div>
      <div className={"h-52 relative"}>
        <div className={"absolute w-full h-full"}>
          <img
            src={bgHome}
            className={"h-full w-full object-cover object-[50%_75%]"}
          />
        </div>
        <div
          className={"h-full w-full absolute"}
          style={{
            background: "linear-gradient(90deg, #000 18.54%, transparent)",
          }}
        ></div>
        <div className={"absolute  lg:w-[50%] w-[75%]"}>
          <div className="text-white text-4xl font-extrabold px-12 pb-4">
            {eventsList[0]?.officialName}
          </div>
          <div className="text-white flex px-12 pb-12 space-x-2">
            <img
              src="https://photos.motogp.com/countries/flags/iso2/fra.svg"
              alt="FR flag"
              className="w-6 boder border-white"
            />
            <div className={"divide-x flex"}>
              <div className="pr-2">
                {selectedEventDetails?.circuit?.locationCity}
              </div>
              <div className="px-2">{selectedEventDetails?.startDate}</div>
            </div>
          </div>
        </div>
      </div>

      {/*// result table*/}
      <div>
        <div className={"mx-14 mt-14 mb-7 bg-white"}>
          <div>
            <Table
              title={() => (
                <div className={"flex space-x-4"}>
                  <SunOutlined className={"text-3xl"}/>
                  <div className={"flex flex-col"}>
                    <span>Clear</span>
                    <span>23º</span>
                  </div>
                  <div className={"flex flex-col"}>
                    <span>Track conditions</span>
                    <span>Dry</span>
                  </div>
                  <div className={"flex flex-col"}>
                    <span>Humidity</span>
                    <span>55%</span>
                  </div>
                  <div className={"flex flex-col"}>
                    <span>Ground</span>
                    <span>28º</span>
                  </div>
                </div>
              )}
              columns={columns}
              dataSource={null}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Result;
