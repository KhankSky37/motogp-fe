import React from "react";
import { Table } from "antd";
import { SunOutlined } from "@ant-design/icons";
import {getImageUrl} from "../../../utils/urlHelpers.jsx";

const ResultsTable = ({ loading, sessionData }) => {
  const columns = [
    {
      title: "Pos.",
      dataIndex: "position",
      key: "position",
      align: "center",
    },
    {
      title: "Pts",
      dataIndex: "points",
      key: "points",
      align: "center",
    },
    {
      title: "image",
      dataIndex: ["rider", "photoUrl"],
      key: "riderImage",
      width: 200,
      render: (photoUrl) => (
        <div className="h-20 overflow-hidden">
          <img
            src={getImageUrl(photoUrl)}
            className="w-40 object-cover object-top" /* object-top để hiển thị phần trên của ảnh */
          />
        </div>
      ),
    },
    {
      title: "Rider",
      dataIndex: ["rider", "name"],
      key: "riderName",
      render: (name, record) => name || `${record.rider?.firstName || ''} ${record.rider?.lastName || ''}`,
    },
    {
      title: "Team",
      dataIndex: ["team", "name"],
      key: "teamName",
    },
    // {
    //   title: "Lead Gap",
    //   dataIndex: "gapMillis",
    //   key: "gapMillis",
    //   align: "right",
    //   render: (gap) => formatTime(gap),
    // },
    // {
    //   title: "Prev Gap",
    //   dataIndex: "prevGap",
    //   key: "prevGap",
    //   align: "right",
    //   render: (gap) => formatTime(gap),
    // },
    {
      title: "Laps",
      dataIndex: "laps",
      key: "laps",
      align: "center",
    },
    // {
    //   title: "Fastest Lap",
    //   dataIndex: "fastestLap",
    //   key: "fastestLap",
    //   align: "center",
    //   render: (time) => formatTime(time),
    // },
  ];

  // Helper function to format time values
  // const formatTime = (milliseconds) => {
  //   if (!milliseconds) return "-";
  //
  //   const isPositive = milliseconds >= 0;
  //   const absMs = Math.abs(milliseconds);
  //   const minutes = Math.floor(absMs / 60000);
  //   const seconds = Math.floor((absMs % 60000) / 1000);
  //   const ms = absMs % 1000;
  //
  //   const formattedTime = `${minutes ? `${minutes}:` : ''}${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  //   return isPositive ? formattedTime : `+${formattedTime}`;
  // };

  return (
    <div className="mx-14 mt-14 mb-7 bg-white">
      <Table
        loading={loading}
        dataSource={sessionData}
        columns={columns}
        rowKey="position"
        size={"small"}
        pagination={false}
        title={() => (
          <div className="flex space-x-4">
            <SunOutlined className="text-3xl" />
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