import React, { useEffect, useState } from "react";
import ContractService from "../../../services/ContractService";
import TeamService from "../../../services/TeamService";
import RiderService from "../../../services/RiderService.jsx";
import CategoryService from "../../../services/CategoryService.jsx";
import TeamCard from "./TeamCard";
import { Spin, Alert } from "antd";
import { Link } from "react-router-dom";

const cardColors = ["#ff4d4f", "#8c8c8c", "#13c2c2", "#9254de", "#fa8c16", "green"];

// ✅ Định nghĩa thứ tự cố định & tên hiển thị
const CATEGORY_ORDER = [
  { id: "motogp", label: "MotoGP™" },
  { id: "moto2", label: "Moto2™" },
  { id: "moto3", label: "Moto3™" },
  { id: "motoe", label: "MotoE™" },
];

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

        const uniqueCategoryIds = Array.from(new Set(contracts.map((c) => c.categoryId)));
        setCategories(uniqueCategoryIds);

        // ✅ Ưu tiên chọn 'motogp' nếu có
        if (uniqueCategoryIds.includes("motogp")) {
          setActiveCategory("motogp");
        } else if (uniqueCategoryIds.length > 0) {
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

  const filteredContracts = allContracts.filter((c) => c.categoryId === activeCategory);

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
        .sort((a, b) => a.name.localeCompare(b.name));

      return {
        id: team.id,
        name: team.name,
        nationality: team.nationality || "Unknown",
        logoPath: team.logoUrl,
        riders: teamRiders,
      };
    })
    .filter((team) => team.riders.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="p-12">
      {/* ✅ Tabs với thứ tự cố định */}
      <div className="flex flex-wrap gap-3 mb-6">
        {CATEGORY_ORDER.filter((cat) => categories.includes(cat.id)).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`font-MGPText px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm text-sm uppercase ${
              activeCategory === id
                ? "bg-red-700 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-blue-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ✅ Danh sách đội đua */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {visibleTeams.map((team, index) => {
          const bgColor = cardColors[index % cardColors.length];
          return (
            <Link key={team.id} to={`${team.id}`}>
              <TeamCard team={team} bgColor={bgColor} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Team;
