import React, {useEffect, useState} from 'react';
import {getImageUrl} from "../../../utils/urlHelpers.jsx";
import {Link, useParams} from "react-router-dom";
import RiderService from "../../../services/RiderService.jsx";
import {Avatar, Button, Col, Row, Spin, Typography} from "antd";
import {ArrowLeftOutlined, RightOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import ReactCountryFlag from "react-country-flag";

const {Title, Text} = Typography;

const RiderDetail = () => {
  const {riderId} = useParams();
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const backgroundText = (rider.lastName|| 'RIDER').toUpperCase();


  return (
    <div
      className="h-[720px] relative bg-gradient-to-br from-[#200020] via-[#1a0a23] to-[#100a1a] text-white font-sans ">
      <div className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-l to-black from-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-b to-black from-transparent"></div>
      <div className="absolute inset-0 bg-black opacity-0"></div>

      <div className="relative container mx-12 px-4 py-8 md:py-16">
        <div className="mb-4">
          <Link to="/riders"
                className="text-white hover:text-white transition-colors duration-300 inline-flex items-center">
            <ArrowLeftOutlined className="mr-2"/>
            ALL RIDERS
          </Link>
        </div>
        <Row align="middle">
          <Col xs={24} md={12} className="z-10">
            <div className="text-3xl font-bold text-white">
              #{riderRacingNumber}
            </div>
            <Title
                   className="!text-7xl !font-extrabold !text-white !uppercase !leading-tight !mb-3">
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
              <Text className="text-lg text-gray-300">{rider.nationality}</Text>
              <span className="text-gray-500">|</span>
              <Text className="text-lg text-gray-300">{rider.teamName || "N/A Team"}</Text>
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
      <div className={"absolute bottom-0 z-1 right-0 text-gray-400 text-[300px] font-black"}>
        {backgroundText}
      </div>
    </div>
  );
};

export default RiderDetail;