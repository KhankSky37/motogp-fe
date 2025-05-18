import React, {useEffect} from 'react';
import SearchForm from "../../../components/user/standing/SearchForm.jsx";
import {Form, message, Select, Table} from "antd";
import SeasonService from "../../../services/SeasonService.jsx";
import StandingBanner from "../../../components/user/standing/StandingBanner.jsx";
import {getImageUrl} from "../../../utils/urlHelpers.jsx";
import ReactCountryFlag from "react-country-flag";

const Standing = () => {
  const [form] = Form.useForm();
  const [seasonYears, setSeasonYears] = React.useState([]);
  const watchedType = Form.useWatch('type', form);

  const columns = [
    {
      title: "Pos.",
      dataIndex: "position",
      key: "position",
      align: "center",
      width: "100px",
      render: (text) => (
        <span className={"font-extrabold text-3xl"}>{text}</span>
      ),
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
        <span className={"font-semibold text-gray-400 text-xl"}>{text}</span>
      ),
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
      align: "center",
      width: "100px",
    // },
    // {
    //   title: "Time",
    //   dataIndex: "timeMillis",
    //   key: "timeMillis",
    //   align: "center",
    //   render: (text) => {
    //     const formattedTime = formatTime(text);
    //     return (
    //       <span className={"text-lg"}>
    //         {formattedTime}
    //       </span>
    //     );
    //   }
    },
  ];


  useEffect(() => {
    const fetchSeasonYears = async () => {
      try {
        const response = await SeasonService.getAllSeasons();
        if (response && response.data) {
          const yearsData = response.data
            .map((season) => String(season.id))
            .sort((a, b) => b.localeCompare(a)); // Sort descending
          setSeasonYears(yearsData);
          if (yearsData.length > 0) {
            form.setFieldsValue({year: yearsData[0], type: 'rider'});
          }
        } else {
          setSeasonYears([]);
          message.error("Could not fetch season years.");
        }
      } catch (error) {
        console.error("Failed to fetch season years:", error);
        message.error("Failed to load season years. Please try again.");
        setSeasonYears([]);
      }
    };

    fetchSeasonYears();
  }, [form]);

  return (
    <div>
      <div className={"px-12 relative bg-[#c80502]"}>
        <div className="absolute inset-0 bg-black opacity-85"></div>
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-l to-black from-transparent"></div>
        <SearchForm form={form} seasonYears={seasonYears}/>
      </div>
      <StandingBanner type={watchedType}/>


      <div className="mx-14 mt-14 mb-7">
        <Select className={'w-72 mb-2'} size={'large'} defaultValue={"motogp"}>
          <Select.Option value="motogp">MotoGP</Select.Option>
          <Select.Option value="moto2">Moto2</Select.Option>
          <Select.Option value="moto3">Moto3</Select.Option>
          <Select.Option value="motoe">MotoE</Select.Option>
        </Select>
        <Table
          columns={columns}
          className={""}
        />
      </div>
    </div>
  );
};

export default Standing;