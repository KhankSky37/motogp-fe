import React, { useEffect, useState } from "react";
import ContractService from "../../../services/ContractService";
import TeamService from "../../../services/TeamService";
import RiderService from "../../../services/RiderService.jsx";
import CategoryService from "../../../services/CategoryService.jsx";
import TeamCard from "./TeamCard";
import { Spin, Alert } from "antd";

const Team = () => {
    const [teamRidersData, setTeamRidersData] = useState([]);
    const [allContracts, setAllContracts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [contractsRes, teamsRes, ridersRes] = await Promise.all([
                    ContractService.getAllContracts(),
                    TeamService.getAllTeams(),
                    RiderService.getAllRiders(),
                ]);

                const contracts = contractsRes.data;
                const teams = teamsRes.data;
                const riders = ridersRes.data;
                setAllContracts(contracts);

                const uniqueCategoryIds = Array.from(
                    new Set(contracts.map((c) => c.categoryId))
                );
                setCategories(uniqueCategoryIds);
                if (uniqueCategoryIds.length > 0) {
                    setActiveCategory(uniqueCategoryIds[0]);
                }

                const categoryMap = {};
                await Promise.all(
                    uniqueCategoryIds.map(async (catId) => {
                        try {
                            const res = await CategoryService.getCategoryById(catId);
                            categoryMap[catId] = res.data?.name || "Unknown Category";
                        } catch (err) {
                            categoryMap[catId] = "Unknown Category";
                        }
                    })
                );

                setTeamRidersData({ teams, riders, categoryMap });
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                setError("Lỗi khi tải dữ liệu");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Spin size="large" />;
    if (error) return <Alert message={error} type="error" showIcon />;

    const { teams = [], riders = [] } = teamRidersData;

    const filteredContracts = allContracts.filter(
        (c) => c.categoryId === activeCategory && c.riderRole === "Factory Rider"
    );

    const teamRidersMap = {};
    filteredContracts.forEach(({ teamId, riderId }) => {
        if (!teamRidersMap[teamId]) {
            teamRidersMap[teamId] = [];
        }
        teamRidersMap[teamId].push(riderId);
    });

    const visibleTeams = teams
        .map((team) => {
            const riderIds = teamRidersMap[team.id] || [];
            const teamRiders = riderIds
                .map((riderId) => {
                    const rider = riders.find((r) => r.riderId === riderId);
                    if (!rider) return null;
                    return {
                        id: rider.riderId,
                        name: `${rider.firstName} ${rider.lastName}`,
                        categoryId: activeCategory,
                    };
                })
                .filter(Boolean)
                .sort((a, b) => a.name.localeCompare(b.name)); // Sắp xếp rider trong team theo ABC

            return {
                id: team.id,
                name: team.name,
                nationality: team.nationality || "Unknown",
                logoPath: team.logoUrl,
                riders: teamRiders,
            };
        })
        .filter((team) => team.riders.length > 0)
        .sort((a, b) => a.name.localeCompare(b.name)); // ✅ Sắp xếp các team theo tên team

    return (
        <div className="p-4">
            {/* Tabs categoryId */}
            <div className="flex flex-wrap gap-3 mb-6">
                {categories.map((catId) => (
                    <button
                        key={catId}
                        onClick={() => setActiveCategory(catId)}
                        className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm text-sm uppercase ${
                            activeCategory === catId
                                ? "bg-blue-700 text-white"
                                : "bg-gray-200 text-gray-800 hover:bg-blue-100"
                        }`}
                    >
                        {catId}
                    </button>
                ))}
            </div>

            {/* Danh sách đội đua */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {visibleTeams.map((team) => (
                    <TeamCard key={team.id} team={team} />
                ))}
            </div>
        </div>
    );
};

export default Team;
