import React, {useMemo} from "react";
import {Table} from "antd";
import {SunOutlined} from "@ant-design/icons";
import {getImageUrl} from "../../../utils/urlHelpers.jsx";
import ReactCountryFlag from "react-country-flag";

const ResultsTable = ({loading, resultData, sessionType}) => {
  const columns = [
    {
      title: "Pos.",
      dataIndex: "position",
      key: "position",
      align: "center",
      width: "100px",
      render: (text) => (
        <span className={"font-extrabold text-3xl font-MGPDisplay"}>{text}</span>
      ),
    },
    {
      title: "Pts",
      dataIndex: "points",
      key: "points",
      align: "center",
      width: "100px",
      render: (points, record) => {
        if (
          record.status &&
          ["DNF", "DNS", "DSQ", "RET"].includes(record.status.toUpperCase())
        ) {
          points = "-";
        }
        return <span className={"text-gray-400 text-3xl font-MGPDisplay font-light" +
          ""}>{points}</span>;
      },
    },
    {
      title: "Rider",
      key: "rider",
      align: "center",
      width: 400,
      render: (_, record) => {
        const riderName =
          record.rider?.name ||
          `${record.rider?.firstName || ""} ${record.rider?.lastName || ""}`;
        const photoUrl = record.rider?.photoUrl;
        const countryCode = record.rider?.nationality;

        return (
          <div className="flex items-center">
            {/* Ảnh tay đua */}
            <div className="h-20 w-2/5 overflow-hidden mr-4">
              <img
                src={getImageUrl(photoUrl)}
                className="w-full h-full object-cover object-top"
                alt={riderName}
              />
            </div>

            <div className={"w-3/5"}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-xl">{riderName}</span>
                {countryCode && (
                  <ReactCountryFlag
                    countryCode={countryCode}
                    svg
                    style={{
                      width: "26px",
                      height: "auto",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Team",
      dataIndex: ["team", "name"],
      key: "teamName",
      render: (text) => (
        <span className={"font-medium text-gray-400 text-xl font-MGPText"}>{text}</span>
      ),
    },
    {
      title: "Time",
      dataIndex: "timeMillis",
      key: "timeMillis",
      align: "center",
      render: (text) => {
        const formattedTime = formatTime(text);
        return (
          <span className={"text-lg font-medium font-MGPText"}>
            {formattedTime}
          </span>
        );
      }
    },
  ];

  const shouldShowPointsColumn =
    sessionType === "RACE" || sessionType === "SPRINT";

  if (!shouldShowPointsColumn) {
    columns.splice(1, 1);
  }
  const formatTime = (milliseconds) => {
    if (!milliseconds) return "-";

    const isPositive = milliseconds >= 0;
    const absMs = Math.abs(milliseconds);
    const minutes = Math.floor(absMs / 60000);
    const seconds = Math.floor((absMs % 60000) / 1000);
    const ms = absMs % 1000;

    const formattedTime = `${minutes ? `${minutes}:` : ''}${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    return isPositive ? formattedTime : `+${formattedTime}`;
  };

  const sortedData = useMemo(() => {
    if (!resultData || !Array.isArray(resultData)) return [];

    return [...resultData].sort((a, b) => {
      // Xử lý trường hợp đặc biệt cho các trạng thái như DNF, DNS
      const statusA = a.status?.toUpperCase();
      const statusB = b.status?.toUpperCase();

      // Các trường hợp đặc biệt sẽ được xếp sau các vị trí thông thường
      const specialStatusA = ["DNF", "DNS", "DSQ", "RET"].includes(statusA);
      const specialStatusB = ["DNF", "DNS", "DSQ", "RET"].includes(statusB);

      if (specialStatusA && !specialStatusB) return 1;
      if (!specialStatusA && specialStatusB) return -1;

      // Nếu cả hai đều là trạng thái đặc biệt, sắp xếp theo position
      if (specialStatusA && specialStatusB) {
        const posA = parseInt(a.position, 10);
        const posB = parseInt(b.position, 10);
        return isNaN(posA) || isNaN(posB) ? 0 : posA - posB;
      }

      // Sắp xếp theo position (trường hợp thông thường)
      const posA = parseInt(a.position, 10);
      const posB = parseInt(b.position, 10);

      if (isNaN(posA)) return 1;
      if (isNaN(posB)) return -1;

      return posA - posB;
    });
  }, [resultData]);
  return (
    <div className="mx-14 mt-14 mb-7 bg-white">
      <Table
        loading={loading}
        dataSource={sortedData}
        columns={columns}
        rowKey="position"
        size={"small"}
        pagination={false}
        title={() => (
          <div className="flex space-x-4">
            <SunOutlined className="text-3xl"/>
            <div className="flex flex-col">
              <span>Clear</span>
              <span>23º</span>
            </div>
            <div className="flex flex-col">
              <span>Track conditions</span>
              <span>Dry</span>
            </div>
            <div className="flex flex-col">
              <span>Humidity</span>
              <span>55%</span>
            </div>
            <div className="flex flex-col">
              <span>Ground</span>
              <span>28º</span>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default ResultsTable;
