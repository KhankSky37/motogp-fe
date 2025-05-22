import React from 'react';
import {Table} from "antd";

const ConstructorStandingTable = ({constructorStandings}) => {
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
      title: "Constructor",
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
        dataSource={constructorStandings}
        pagination={false}
      />
    </div>
  );
};

export default ConstructorStandingTable;