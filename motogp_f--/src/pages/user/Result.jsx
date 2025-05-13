import React, {useEffect, useState} from 'react';
import {Col, ConfigProvider, Form, message, Row, Select, Tabs, theme} from "antd";
import bgHome from "../../assets/bg_results.png";
import SeasonService from "../../services/SeasonService.jsx";

const Result = () => {
  const [form] = Form.useForm();
  const [seasonYears, setSeasonYears] = useState([]); // State for fetched years

  const items = [
    {
      key: '1',
      label: <span className="font-semibold">RESULTS</span>,
    },
    {
      key: '2',
      label: <span className="font-semibold">STANDINGS</span>,
    },
    {
      key: '3',
      label: <span className="font-semibold">RECORDS</span>,
    },
  ];


  // Dữ liệu mẫu - bạn sẽ cần thay thế bằng dữ liệu thực tế hoặc fetch từ API
  // const years = ['2024', '2023', '2022', '2021']; // Ví dụ
  const types = ['All Events','Grands Prix']; // Ví dụ
  const events = [ // Ví dụ - nên được cập nhật dựa trên năm và loại được chọn
    {id: 'qatar', name: 'Qatar Grand Prix'},
    {id: 'portugal', name: 'Portuguese Grand Prix'},
    {id: 'americas', name: 'Grand Prix of The Americas'},
  ];
  const categories = ['Race', 'Qualifying', 'Practice 1', 'Practice 2']; // Ví dụ
  const sessions = ['Full Session', 'Highlights', 'Last 5 Minutes']; // Ví dụ


  useEffect(() => {
    const fetchSeasonYears = async () => {
      try {
        const response = await SeasonService.getAllSeasons();
        // Assuming response.data is an array of season objects
        // And each season object has an 'id' (e.g., 2024) or 'name' (e.g., "2024") that represents the year.
        // Let's assume 'id' is the year and convert it to a string.
        // Adjust .map() based on your actual Season DTO structure.
        if (response && response.data) {
          const yearsData = response.data.map(season => String(season.id)).sort((a, b) => b.localeCompare(a)); // Sort descending
          setSeasonYears(yearsData);
        } else {
          setSeasonYears([]);
          message.error('Could not fetch season years.');
        }
      } catch (error) {
        console.error("Failed to fetch season years:", error);
        message.error("Failed to load season years. Please try again.");
        setSeasonYears([]);
      }
    };

    fetchSeasonYears();
  }, []);


  return (
    <>
      <div className={'px-12 pt-4 pb-10 relative bg-[#c80502]'}>
        <div className="absolute inset-0 bg-black opacity-85"></div>
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-l to-black from-transparent"></div>
        <span className={'relative text-5xl font-extrabold text-white'}>RESULTS</span>
      </div>
      <div className={"px-12 bg-black"}>
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                itemColor: '#ffffff',
                itemSelectedColor: '#ffffff',
                itemHoverColor: '#ffffff',
                inkBarColor: '#ffffff',
              },
            },
          }}
        >
          <Tabs defaultActiveKey="1" items={items} rootClassName={'relative'}/>;
        </ConfigProvider>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
          }}
        >
          <Form
            form={form}
            name="motogp_search"
            layout="vertical"
          >
            <Row gutter={16}>
              <Col md={24} lg={4}>
                <Form.Item
                  name="year"
                >
                  <Select placeholder="Select Year">
                    {seasonYears.map(year => (
                      <Option key={year} value={year}>{year}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col md={24} lg={4}>
                <Form.Item
                  name="type"
                >
                  <Select placeholder="Select Type">
                    {types.map(type => (
                      <Option key={type} value={type}>{type}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col md={24} lg={4}>
                <Form.Item
                  name="event"
                >
                  <Select placeholder="Select Event" showSearch filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }>
                    {events.map(event => (
                      <Option key={event.id} value={event.id}>{event.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col md={24} lg={4}>
                <Form.Item
                  name="category"
                >
                  <Select placeholder="Select Category">
                    {categories.map(category => (
                      <Option key={category} value={category}>{category}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col md={24} lg={4}>
                <Form.Item
                  name="session"
                >
                  <Select placeholder="Select Session">
                    {sessions.map(session => (
                      <Option key={session} value={session}>{session}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ConfigProvider>

      </div>
      <div
        className={"h-52 relative"}
      >
        <div className={'absolute w-full h-full'}>
          <img src={bgHome} className={"h-full w-full object-cover object-[50%_75%]"}
          />
        </div>
        <div className={"h-full w-full absolute"}
             style={{background: 'linear-gradient(90deg, #000 18.54%, transparent)'}}>
        </div>
        <div className={"absolute  lg:w-[50%] w-[75%]"}>
          <div className="text-white text-4xl font-extrabold px-12 pb-4">Michelin® Grand Prix of France 2025</div>
          <div className="text-white flex divide-x px-12 pb-12">
            <div className="pr-2">Le Mans</div>
            <div className="px-2">9 - 11 May</div>
          </div>
        </div>
      </div>
      v
    </>
  );
};

export default Result;