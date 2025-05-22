import React from 'react';
import {Table} from "antd";
import {getImageUrl} from "../../../utils/urlHelpers.jsx";
import ReactCountryFlag from "react-country-flag";

const RiderStandingTable = ({riderStandings}) => {
  const columns = [
    {
      title: "Pos.",
      dataIndex: "position",
      key: "position",
      align: "center",
      width: "100px",
      render: (_, record, index) => <span className={"font-extrabold text-3xl font-MGPDisplay"}>{index + 1}</span>
    },
    {
      title: "Rider",
      key: "rider",
      align: "center",
      width: 400,
      render: (_, record) => {
        const riderName = `${record.firstName || ""} ${record.lastName || ""}`;
        const photoUrl = record.photoUrl;
        const countryCode = record.nationality;

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
      dataIndex: "teamName",
      key: "teamName",
      render: (text) => (
        <span className={"font-medium text-gray-400 text-xl font-MGPText"}>{text}</span>
      ),
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
      align: "center",
      width: "100px",
      render: (text) => <span className={"font-extrabold text-3xl font-MGPDisplay"}>{text}</span>
    },
  ];
  const getRowClassName = (record, index) => {
    if (index === 0) {
      return 'bg-[#c80502] hover:text-black transition text-white inset-y-0 left-0 w-full bg-gradient-to-l to-black from-transparent';
    }
    return '';
  };
  return (
    <div>
      <Table
        columns={columns}
        dataSource={riderStandings}
        pagination={false}
        rowClassName={getRowClassName}
      />
    </div>
  );
};

export default RiderStandingTable;