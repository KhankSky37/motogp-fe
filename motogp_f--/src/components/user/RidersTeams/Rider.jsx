import React, { useEffect, useState } from "react";
import ContractService from "../../../services/ContractService.jsx";
import RiderService from "../../../services/RiderService.jsx";
import TeamService from "../../../services/TeamService.jsx";
import RiderCard from "./RiderCard.jsx";
import { Spin, Alert } from "antd";
import { Link } from "react-router-dom";
import TshirtsSection from "../home/TshirtsSection.jsx";
import FeaturedContent from "../home/FeaturedContent.jsx";
import WhoIs from "../../../assets/Who_is_your_favourite_rider.webp";

// ✅ Thứ tự cố định và tên hiển thị cho category
const CATEGORY_ORDER = [
    { id: "motogp", label: "MotoGP™" },
    { id: "moto2", label: "Moto2™" },
    { id: "moto3", label: "Moto3™" },
    { id: "motoe", label: "MotoE™" },
];

const Rider = () => {
    const [contracts, setContracts] = useState([]);
    const [riders, setRiders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [teams, setTeams] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const cardColors = ["#ff4d4f", "#8c8c8c", "#13c2c2", "#9254de", "#fa8c16"];

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [resContracts, resRiders] = await Promise.all([
                    ContractService.getAllContracts(),
                    RiderService.getAllRiders(),
                ]);

                const contractsData = resContracts.data;
                const ridersData = resRiders.data;

                setContracts(contractsData);
                setRiders(ridersData);

                const teamIds = Array.from(new Set(contractsData.map((c) => c.teamId)));

                const teamCache = {};
                const fetchTeamIfNeeded = async (teamId) => {
                    if (teamCache[teamId]) return teamCache[teamId];
                    try {
                        const res = await TeamService.getTeamById(teamId);
                        teamCache[teamId] = res.data;
                        return res.data;
                    } catch (err) {
                        console.error("Không thể lấy team:", teamId, err);
                        return { id: teamId, name: "Unknown Team" };
                    }
                };

                const teamData = await Promise.all(teamIds.map((id) => fetchTeamIfNeeded(id)));
                const teamMap = {};
                teamData.forEach((team) => {
                    teamMap[team.id] = team;
                });
                setTeams(teamMap);

                const uniqueCategories = Array.from(new Set(contractsData.map((c) => c.categoryId)));
                setCategories(uniqueCategories);
                if (uniqueCategories.includes("motogp")) {
                    setActiveCategory("motogp");
                } else if (uniqueCategories.length > 0) {
                    setActiveCategory(uniqueCategories[0]);
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to load data");
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) return <Spin size="large" />;
    if (error) return <Alert message={error} type="error" showIcon />;

    const filteredContracts = contracts.filter((c) => c.categoryId === activeCategory);
    const rolesInCategory = Array.from(new Set(filteredContracts.map((c) => c.riderRole)));

    const findRiderById = (id) => riders.find((r) => r.riderId === id || r.id === id);

    return (
      <>
          <div className="p-12">
              {/* ✅ Tabs với thứ tự cố định */}
              <div className="flex flex-wrap gap-3 mb-6">
                  {CATEGORY_ORDER.filter((cat) => categories.includes(cat.id)).map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setActiveCategory(id)}
                      className={`px-5 py-2 rounded-full font-medium font-MGPText transition-all duration-300 shadow-sm text-sm uppercase ${
                        activeCategory === id
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-blue-100"
                      }`}
                    >
                        {label}
                    </button>
                  ))}
              </div>

              {/* Riders theo vai trò */}
              <div className="space-y-10">
                  {rolesInCategory.map((role) => {
                      const contractsInRole = filteredContracts.filter((c) => c.riderRole === role);

                      return (
                        <div key={role}>
                            <h2 className="text-[37px] font-bold font-MGPDisplay text-black mb-4">{role}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {contractsInRole.length > 0 ? (
                                  [...contractsInRole]
                                    .sort((a, b) => {
                                        const getNumber = (riderId) => {
                                            const match = riderId.match(/\d+$/);
                                            return match ? parseInt(match[0], 10) : 0;
                                        };
                                        return getNumber(a.riderId) - getNumber(b.riderId);
                                    })
                                    .map((contract, index) => {
                                        const rider = findRiderById(contract.riderId);
                                        if (!rider) return null;

                                        const bgColor = cardColors[index % cardColors.length];

                                        return (
                                          <Link to={`/riders/${rider.riderId}`} key={rider.riderId}>
                                              <RiderCard
                                                rider={rider}
                                                teamName={teams[contract.teamId]?.name || "Unknown Team"}
                                                bgColor={bgColor}
                                              />
                                          </Link>
                                        );
                                    })
                                ) : (
                                  <div className="text-gray-500">Không có rider nào cho vai trò này</div>
                                )}
                            </div>
                        </div>
                      );
                  })}
              </div>
          </div>

          <TshirtsSection />

          <FeaturedContent
            title="👀👀 Who's your favourite rider? 👀👀"
            description="Personalize your MotoGP™ experience by logging in and selecting your all-time favourite rider on your account!"
            buttonText="Select rider now!"
            reverse={true}
            buttonLink="#"
            imageUrl={WhoIs}
          />
      </>
    );
};

export default Rider;
