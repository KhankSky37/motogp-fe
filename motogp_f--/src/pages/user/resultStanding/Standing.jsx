import React, {useEffect} from 'react';
import SearchForm from "../../../components/user/standing/SearchForm.jsx";
import {Form, message, Select} from "antd";
import SeasonService from "../../../services/SeasonService.jsx";
import StandingBanner from "../../../components/user/standing/StandingBanner.jsx";
import StandingService from "../../../services/StandingService.jsx";
import RiderStandingTable from "../../../components/user/standing/RiderStandingTable.jsx";
import TeamStandingTable from "../../../components/user/standing/TeamStandingTable.jsx";

const Standing = () => {
  const [form] = Form.useForm();
  const [seasonYears, setSeasonYears] = React.useState([]);
  const watchedType = Form.useWatch('type', form);
  const [riderStandings, setRiderStandings] = React.useState([]);
  const [teamStandings, setTeamStandings] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState("motogp");
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

  useEffect(() => {
    const fetchStanding = async () => {
      const currentYear = form.getFieldValue("year");
      const currentType = form.getFieldValue("type");
      try {
        const response = await StandingService.getStandings(currentYear, selectedCategory, currentType);
        if (currentType === "team") {
          setTeamStandings(response.data);
        } else if (currentType === "rider") {
          setRiderStandings(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch rider standings:", error);
      }
    }
    fetchStanding();
  }, [form.getFieldValue("year"), form.getFieldValue("type")]);

  return (
    <div>
      <div className={"px-12 relative bg-[#c80502]"}>
        <div className="absolute inset-0 bg-black opacity-85"></div>
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-l to-black from-transparent"></div>
        <SearchForm form={form} seasonYears={seasonYears}/>
      </div>
      <StandingBanner type={watchedType}/>


      <div className="mx-14 mt-14 mb-7">
        <Select className={'w-72 mb-2'} size={'large'} defaultValue={"motogp"}
                onChange={(value) => setSelectedCategory(value)}>
          <Select.Option value="motogp">MotoGP</Select.Option>
          <Select.Option value="moto2">Moto2</Select.Option>
          <Select.Option value="moto3">Moto3</Select.Option>
          <Select.Option value="motoe">MotoE</Select.Option>
        </Select>
        {watchedType === "team" && (
          <TeamStandingTable teamStandings={teamStandings}/>
        )}
        {watchedType === "rider" &&
          <RiderStandingTable riderStandings={riderStandings}/>
        }
      </div>
    </div>
  );
};

export default Standing;