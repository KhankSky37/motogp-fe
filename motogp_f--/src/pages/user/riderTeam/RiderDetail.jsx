import React, {useEffect, useState} from 'react';
import {getImageUrl} from "../../../utils/urlHelpers.jsx";
import {Link, useParams} from "react-router-dom";
import RiderService from "../../../services/RiderService.jsx";
import {Button, Col, Row, Spin, Typography} from "antd";
import {ArrowLeftOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import ReactCountryFlag from "react-country-flag";
import { COUNTRIES } from "../../../constants/Countries.jsx"; // Added import

const {Title, Text} = Typography;

const RiderDetail = () => {
  const {riderId} = useParams();
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const countryName = COUNTRIES.find(country => country.code === rider.nationality)?.name || rider.nationality;

  useEffect(() => {
    const fetchRiderData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await RiderService.getRiderById(riderId);
        setRider(response.data);
      } catch (err) {
        console.error("Error fetching rider data:", err);
        setError("Failed to load rider data.");
      } finally {
        setLoading(false);
      }
    };
    if (riderId) {
      fetchRiderData();
    }
  }, [riderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Spin size="large"/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
        <Title level={3} className="!text-red-500">{error}</Title>
        <Link to="/riders">
          <Button type="primary" icon={<ArrowLeftOutlined/>} className="mt-4">
            Back to Riders
          </Button>
        </Link>
      </div>
    );
  }

  if (!rider) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
        <Title level={3} className="!text-yellow-400">Rider not found.</Title>
        <Link to="/riders">
          <Button type="primary" icon={<ArrowLeftOutlined/>} className="mt-4">
            Back to Riders
          </Button>
        </Link>
      </div>
    );
  }

  const riderRacingNumber = rider.racingNumber || riderId;
  const riderDisplayName = `${rider.firstName || ''} ${rider.lastName || ''}`.trim();
  const backgroundText = (rider.lastName || 'RIDER').toUpperCase();

  // Helper function to format date if needed
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      // Adjust formatting as needed, e.g., to DD/MM/YYYY
      return date.toLocaleDateString('en-GB'); // Example: 29/01/1998
    } catch (e) {
      return dateString; // Return original if formatting fails
    }
  };

  // Placeholder data - replace with actual data from your rider object
  const riderBioData = [
    {label: 'DATE OF BIRTH', value: rider?.dateOfBirth ? formatDate(rider.dateOfBirth) : 'N/A'},
    {label: 'NATIONALITY', value: rider?.nationality ? `${rider.nationality}` : 'N/A'},
    {label: 'HEIGHT', value: rider?.height ? `${rider.height} cm` : 'N/A'},
    {label: 'WEIGHT', value: rider?.weight ? `${rider.weight} kg` : 'N/A'},
  ];

  const riderStory = `${riderDisplayName} joined the Red Bull Rookies Cup for the 2012 season. Unfortunately it was a season plagued by various injuries, but the following year he tried again and finished runner-up behind the 2013 champion Karel Hanika. In 2014 he dominated the same Championship and took the crown. For 2015 Martín took the next step and participated in his first full season in the Moto3™ World Championship, where he joined the Mahindra Mapfre Aspar team. An awesome seventh in Aragon helped the Spaniard to finish the year 17th overall, with he and the Aspar team electing to continue their relationship for 2016. For 2017, the Spaniard moved to Del Conca Gresini Racing Moto3 to replace outgoing title contender Enea Bastianini. The master of qualifying and on pole for half the entire season, Martin took an impressive nine podiums despite a mid-season injury, and his maiden win in the season finale on the way to P4 overall. His stellar year would arrive in 2018 as Martin beat Marco Bezzecchi to the Moto3™ crown, claiming seven victories despite picking up another mid-season injury.

Red Bull KTM Ajo in Moto2™ became the Spaniards home in 2019, and he rewarded his new team with podium finishes in Japan and Austria toward the tail end of the season. A title charge awaited in 2020, a Spanish GP podium followed up with a victory and podium finish in the Spielberg double, he was right in the Championship mix. However, a positive Covid-19 test meant he missed the Misano double, and successive retirements put to bed any plans of the Championship. There were three more podiums in the final five Grand Prix, including victory in Valencia, which helped him secure fifth place in the standings.

2021 brought a move up to MotoGP™ with Pramac Racing on a GP21, and it's safe to say Martin hit the ground running. A debut pole and podium were secured in Doha before a huge crash in Portimao saw him break eight bones. Missing four races, Martin returned and after the summer break, in Austria, a first victory was his. Two more podiums helped Martin secure the Rookie of the Year crown, and in 2022, the Spaniard was tipped for greatness. Martin was the pole master of 2022, smashing lap records left, right and centre to take five Saturday honours throughout the year. But failed to convert any of them into victory and was unable to build on an excellent rookie campaign. The Spaniard was a wounded animal heading into 2023 after being overlooked for the factory Ducati seat - and he bit back immediately. Martin was a standout performer on his way to four Sunday wins and nine Sprint victories, but his dream of becoming World Champion proved to be just out of reach in Valencia. Nevertheless, Martin remained undeterred and launched a determined title challenge in 2024. The Spaniard began with a victory in the Tissot Sprint on opening night in Qatar and secured his first Grand Prix win of the season at the next round in Portimão. His strong early-season form propelled him into the Championship lead, and his remarkable consistency paved the way for a title-winning campaign. Martin claimed three race victories and a record-setting 16 Grand Prix podiums in 2024. His crowning moment came at the season finale in Barcelona in a rematch with Bagnaia, where a third-place finish secured him a debut MotoGP title.

In 2025, Martin will defend his title with Aprilia Racing. Can the new King of MotoGP turn the RS-GP into a regular race-winning package?`;


  return (
    <>
      <div
        className="h-[720px] relative bg-gradient-to-br from-[#200020] via-[#1a0a23] to-[#100a1a] text-white font-sans ">
        <div className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-l to-black from-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-b to-black from-transparent"></div>
        <div className="absolute inset-0 bg-black opacity-0"></div>

        <div className="relative container mx-12 px-4 py-8 md:py-16">
          <div className="mb-4">
            <Link to="/riders"
                  className="text-white hover:text-white transition-colors duration-300 inline-flex items-center">
              <ArrowLeftOutlined className="mr-2 font-MGPText"/>
              ALL RIDERS
            </Link>
          </div>
          <Row align="middle">
            <Col xs={24} md={12} className="z-10">
              <div className="text-3xl font-bold text-white font-MGPDisplay">
                #{riderRacingNumber}
              </div>
              <Title
                className="!text-7xl !font-extrabold !text-white !uppercase !leading-tight !mb-3 font-MGPDisplay">
                {riderDisplayName}
              </Title>
              <div className="flex items-center space-x-4 mb-6">
                {rider.countryCode && (
                  <img
                    src={`https://flagcdn.com/w40/${rider.countryCode.toLowerCase()}.png`}
                    alt={rider.nationality}
                    className="w-7 h-5 rounded-sm object-cover"
                  />
                )}
                <ReactCountryFlag
                  countryCode={rider?.nationality}
                  svg
                  style={{
                    width: "26px",
                    height: "auto",
                  }}
                />
                <Text className="text-lg text-gray-300 font-MGPText">{countryName}</Text>
              </div>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined/>}
                className="!bg-white !text-black !font-semibold hover:!bg-gray-200"
              >
                SHOP NOW
              </Button>
            </Col>
          </Row>
        </div>
        <div className={'absolute right-0 bottom-0 z-20'}> {/* Changed z-11 to z-20 */}
          {rider.photoUrl && (
            <img
              src={getImageUrl(rider.photoUrl)}
              alt={riderDisplayName}
              className="max-h-[70vh] h-[622px] md:max-h-[80vh] object-contain"
              style={{filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))'}}
            />
          )}
        </div>
        <div className={"absolute bottom-0 z-1 right-0 text-gray-400 text-[300px] font-black font-MGPDisplay"}>
          {backgroundText}
        </div>
      </div>

      <div className="bg-white text-black py-12 md:py-20 px-4">
        <div className="mx-12">
          <Row gutter={[48, 48]}>
            {/* Rider Story Column */}
            <Col xs={24} md={14}>
              <Title level={3} className="!font-bold !text-2xl !mb-6 uppercase tracking-wider font-MGPDisplay">Rider Story</Title>
              <Text className="text-base text-gray-700 leading-relaxed whitespace-pre-line font-MGPText">
                {riderStory}
              </Text>
            </Col>

            {/* Rider Bio Column */}
            <Col xs={24} md={10}>
              <Title level={3} className="!font-bold !text-2xl !mb-6 uppercase tracking-wider font-MGPDisplay">Rider Bio</Title>
              <div className="bg-gray-50 rounded-lg shadow">
                {riderBioData.map((item, index) => (
                  <div key={index}
                       className={`flex justify-between items-center p-4 ${index < riderBioData.length - 1 ? 'border-b border-gray-200' : ''}`}>
                    <Text className="text-sm font-medium text-gray-500 uppercase font-MGPText">{item.label}</Text>
                    <Text className="text-sm font-semibold text-gray-800 font-MGPText">{item.value}</Text>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>

  );
};

export default RiderDetail;