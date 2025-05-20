import React, { useEffect, useState } from "react";
import ContractService from "../../../services/ContractService.jsx";
import RiderService from "../../../services/RiderService.jsx";
import TeamService from "../../../services/TeamService.jsx"; // Thêm import này
import RiderCard from "./RiderCard.jsx";
import { Spin, Alert } from "antd";
import {Link} from "react-router-dom";

const Rider = () => {
    const [contracts, setContracts] = useState([]);
    const [riders, setRiders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [teams, setTeams] = useState({}); // Lưu teamId -> team object
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

                // Lấy danh sách unique teamIds từ contracts
                const teamIds = Array.from(new Set(contractsData.map((c) => c.teamId)));

                // Gọi API lấy team theo teamId, cache kết quả
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

                // Lấy unique categories
                const uniqueCategories = Array.from(new Set(contractsData.map((c) => c.categoryId)));
                setCategories(uniqueCategories);
                if (uniqueCategories.length > 0) {
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
        <div className="p-4">
            {/* Tabs chọn category */}
            <div className="flex flex-wrap gap-3 mb-6">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm text-sm uppercase ${
                            activeCategory === cat
                                ? "bg-blue-700 text-white"
                                : "bg-gray-200 text-gray-800 hover:bg-blue-100"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Hiển thị rider theo vai trò */}
            <div className="space-y-10">
                {rolesInCategory.map((role) => {
                    const contractsInRole = filteredContracts.filter((c) => c.riderRole === role);

                    return (
                        <div key={role}>
                            <h2 className="text-2xl font-extrabold text-blue-800 mb-4">{role}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {contractsInRole.length > 0 ? (
                                    [...contractsInRole]
                                        .sort((a, b) => {
                                            const getNumber = (riderId) => {
                                                const match = riderId.match(/\d+$/); // Tìm số ở cuối
                                                return match ? parseInt(match[0], 10) : 0;
                                            };
                                            return getNumber(a.riderId) - getNumber(b.riderId);
                                        })
                                        .map((contract) => {
                                            const rider = findRiderById(contract.riderId);
                                            if (!rider) return null;

                                            return (
                                              <Link to={`/riders/${rider.riderId}`}>
                                                <RiderCard
                                                    key={rider.riderId || rider.id}
                                                    rider={rider}
                                                    teamName={teams[contract.teamId]?.name || "Unknown Team"}
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
    );
};

export default Rider;
