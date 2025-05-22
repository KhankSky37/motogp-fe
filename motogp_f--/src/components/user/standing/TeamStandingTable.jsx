import React from 'react';
import {Table} from "antd";

const TeamStandingTable = ({teamStandings}) => {
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
      title: "Team",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span className={"font-extrabold text-2xl font-MGPDisplay"}>{text}</span>
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
  return (
    <div>
      <Table
        columns={columns}
        dataSource={teamStandings}
        pagination={false}
      />
    </div>
  );
};

export default TeamStandingTable;