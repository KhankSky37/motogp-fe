import React, {useEffect, useState} from 'react';
import ResultsHeader from "../../../components/user/result/ResultsHeader.jsx";
import {ConfigProvider, Tabs} from "antd";
import {Outlet, useLocation, useNavigate} from "react-router-dom";

const ResultStanding = () => {
  const [title, setTitle] = React.useState("RESULTS");
  const navigate = useNavigate();

  const location = useLocation();
  const [activeTabKey, setActiveTabKey] = useState("RESULTS");


  const items = [
    {
      key: "RESULTS",
      label: <span className="font-semibold text-lg">RESULTS</span>,
    },
    {
      key: "STANDINGS",
      label: <span className="font-semibold text-lg">STANDINGS</span>,
    },
  ];

  useEffect(() => {
    const pathSnippets = location.pathname.split("/").filter((i) => i);
    let currentKey = pathSnippets.length > 0 ? pathSnippets[0].toUpperCase() : "RESULTS";

    if (currentKey === "GP-RESULTS") {
      currentKey = "RESULTS";
    }

    const validKeys = items.map(item => item.key);
    if (validKeys.includes(currentKey)) {
      setActiveTabKey(currentKey);
      setTitle(currentKey);
    } else {
      setActiveTabKey("RESULTS");
      setTitle("RESULTS");
    }
  }, [location.pathname]);


  const onChange = key => {
    setTitle(key);
    if (key === "RESULTS") {
      key = "gp-results";
    }
    navigate(`/${key.toLowerCase()}`);
  };

  return (
    <div>
      <ResultsHeader title={title}/>
      <div className={"px-12 relative bg-[#c80502]"}>
        <div className="absolute inset-0 bg-black opacity-85"></div>
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-l to-black from-transparent"></div>
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                itemColor: "#ffffff",
                itemSelectedColor: "#ffffff",
                itemHoverColor: "#ffffff",
                inkBarColor: "#ffffff",
              },
            },
          }}
        >
          <Tabs activeKey={activeTabKey} items={items} rootClassName={"relative"} onChange={onChange}/>
        </ConfigProvider>
      </div>
      <Outlet/>
    </div>
  );
};

export default ResultStanding;