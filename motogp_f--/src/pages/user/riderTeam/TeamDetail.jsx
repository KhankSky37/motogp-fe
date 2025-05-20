import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import TeamService from "../../../services/TeamService.jsx"; // Changed to TeamService
import {Button, Col, Row, Spin, Typography, List, Avatar} from "antd";
import {ArrowLeftOutlined} from '@ant-design/icons';
import {getImageUrl} from "../../../utils/urlHelpers.jsx";
import ReactCountryFlag from "react-country-flag";
import RiderService from "../../../services/RiderService.jsx";

const {Title, Text} = Typography;

const TeamDetail = () => {
  const {teamId} = useParams();
  const [team, setTeam] = useState(null);
  const [teamRiders, setTeamRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => { // Renamed function
      setLoading(true);
      setError(null);
      try {
        const response = await TeamService.getTeamById(teamId); // Changed service and method
        const ridersResponse = await RiderService.getAllRiders({teamId: teamId});
        setTeam(response.data);
        setTeamRiders(ridersResponse.data);
        console.log("rui data:", ridersResponse.data);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError("Failed to load team data.");
      } finally {
        setLoading(false);
      }
    };
    if (teamId) {
      fetchTeamData();
    }
  }, [teamId]);

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
        <Link to="/teams">
          <Button type="primary" icon={<ArrowLeftOutlined/>} className="mt-4">
            Back to Teams
          </Button>
        </Link>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
        <Title level={3} className="!text-yellow-400">Team not found.</Title>
        <Link to="/teams">
          <Button type="primary" icon={<ArrowLeftOutlined/>} className="mt-4">
            Back to Teams
          </Button>
        </Link>
      </div>
    );
  }

  const teamDisplayName = team.name || 'Team';
  // Assuming team.logoUrl for the main image and team.nationality for the flag
  const backgroundText = (team.name || 'TEAM').toUpperCase().split(' ').slice(-1)[0]; // Use last word of team name for background

  return (
    <div
      className="h-[720px] relative bg-gradient-to-br from-[#200020] via-[#1a0a23] to-[#100a1a] text-white font-sans overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-l to-black from-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-b to-black from-transparent"></div>
      <div className="absolute inset-0 bg-black opacity-0"></div>

      <div className="relative container mx-12 px-4 py-8 md:py-16">
        <div className="mb-4">
          <div className="mb-4">
            <Link to="/teams"
                  className="text-white hover:text-gray-300 transition-colors duration-300 inline-flex items-center text-sm uppercase tracking-wider">
              <ArrowLeftOutlined className="mr-2"/>
              All Teams
            </Link>
          </div>
          <Row align="middle">
            <Col xs={24} md={12} className="z-10">
              <Title level={1} className="!text-6xl !font-extrabold !text-white !uppercase !leading-tight !mb-3"
                     style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>
                {teamDisplayName}
              </Title>
              <div className={'text-gray-400 font-thin'}>
                Bike manufacturer
                <span className="text-xl text-white">
                  {` ${team.manufacturer.name}`}
                </span>
              </div>
            </Col>
            <Col xs={24} md={12}>
              {team.riders && team.riders.length > 0 && (
                <div className="bg-black bg-opacity-30 backdrop-blur-sm p-4 rounded-lg">
                  <Title level={4} className="!text-gray-300 !mb-3">Riders</Title>
                  <List
                    itemLayout="horizontal"
                    dataSource={team.riders}
                    renderItem={(rider) => (
                      <List.Item className="!border-gray-700">
                        <List.Item.Meta
                          avatar={<Avatar src={rider.photoUrl ? getImageUrl(rider.photoUrl) : undefined}
                                          icon={<UserOutlined/>}/>}
                          title={<Link to={`/riders/${rider.riderId}`}
                                       className="text-white hover:text-red-400">{rider.firstName} {rider.lastName}</Link>}
                          description={<Text className="text-gray-400">#{rider.racingNumber}</Text>}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
      <div className={'bottom-0 text-white absolute mx-12 px-4 py-8 md:py-16'}>
        <div className={'text-3xl font-extrabold mb-4'}>TEAM RIDERS</div>
        <div className={'bg-gray-700 px-2 py-1 rounded w-96'}> {/* Removed divide-y and space-y, will handle spacing in map */}
          {teamRiders && teamRiders.length > 0 ? (
            teamRiders.map((rider, index) => (
              <Link to={`/riders/${rider.riderId || rider.id}`} key={rider.riderId || rider.id || index} className={`flex items-center ${index > 0 ? 'mt-2 pt-2 border-t border-gray-600' : ''} hover:bg-gray-600 p-2 rounded transition-colors duration-150`}> {/* Added Link, key, spacing, border, and hover effect */}
                <div className={'w-12 h-12 overflow-hidden mr-4 flex-shrink-0'}>
                  <img
                    src={getImageUrl(rider?.photoUrl)}
                    alt={`${rider?.firstName || ''} ${rider?.lastName || 'Rider'}`}
                    className="w-full h-full object-cover object-top" // Changed object-center to object-top
                  />
                </div>
                <div className={'flex-col flex ml-3'}>
                  <span className="text-sm text-gray-400">#{rider?.racingNumber || rider?.riderId}</span>
                  <span className="text-white font-semibold text-2xl">
                    {rider?.firstName} {rider?.lastName}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-400 text-center py-2">No riders listed for this team.</p> // Fallback if no riders
          )}
        </div>
      </div>

      <div className={'absolute right-0 bottom-[-50%] w-[60%] md:w-[50%] h-auto z-10'}>
        {team.logoUrl && ( // Assuming team.logoUrl or a bike image URL
          <img
            src={getImageUrl(team.logoUrl)} // Or team.bikeImageUrl
            alt={teamDisplayName}
            className="object-contain w-full h-[1040px]"
            style={{filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.5))'}}
          />
        )}
      </div>

      <div
        className={"absolute bottom-[-50px] right-[-20px] text-gray-800 text-[200px] md:text-[300px] font-black opacity-30 select-none z-0"}>
        {backgroundText}
      </div>
    </div>
  );
};

export default TeamDetail;