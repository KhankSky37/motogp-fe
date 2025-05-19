import React, {useEffect} from 'react';
import SearchForm from "../../../components/user/standing/SearchForm.jsx";
import {Form, message, Select} from "antd";
import SeasonService from "../../../services/SeasonService.jsx";
import StandingBanner from "../../../components/user/standing/StandingBanner.jsx";
import StandingService from "../../../services/StandingService.jsx";
import RiderStandingTable from "../../../components/user/standing/RiderStandingTable.jsx";
import TeamStandingTable from "../../../components/user/standing/TeamStandingTable.jsx";
import CategoryService from "../../../services/CategoryService.jsx";
import ConstructorStandingTable from "../../../components/user/standing/ConstructorStandingTable.jsx";
import {ExportOutlined, FilePdfOutlined} from "@ant-design/icons";

const Standing = () => {
  const [form] = Form.useForm();
  const [seasonYears, setSeasonYears] = React.useState([]);
  const watchedType = Form.useWatch('type', form);
  const [riderStandings, setRiderStandings] = React.useState([]);
  const [riderBMWStandings, setRiderBMWStandings] = React.useState([]);
  const [teamStandings, setTeamStandings] = React.useState([]);
  const [constructorStandings, setConstructorStandings] = React.useState([]);

  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [categories, setCategories] = React.useState([]);
  useEffect(() => {
    const fetchSeasonYears = async () => {
      try {
        const response = await SeasonService.getAllSeasons();
        const categoryData = await CategoryService.getAllCategories();
        setCategories(categoryData.data)
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
        } else if (currentType === "BMW") {
          setRiderBMWStandings(response.data)
        } else if (currentType === "constructor") {
          setConstructorStandings(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch rider standings:", error);
      }
    }
    fetchStanding();
  }, [form.getFieldValue("year"), form.getFieldValue("type"), selectedCategory]);

  return (
    <div>
      <div className={"px-12 relative bg-[#c80502]"}>
        <div className="absolute inset-0 bg-black opacity-85"></div>
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-l to-black from-transparent"></div>
        <SearchForm form={form} seasonYears={seasonYears}/>
      </div>
      <StandingBanner type={watchedType}/>


      <div className="mx-14 mt-14 mb-7">
        {watchedType !== "BMW" &&
          <Select className={'w-72 mb-2'} size={'large'} defaultValue={"MotoGp"}
                  onChange={(value) => setSelectedCategory(value)}>
            {categories?.map((category) => (
              <Select.Option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        }

        {watchedType === "team" && (
          <TeamStandingTable teamStandings={teamStandings}/>
        )}
        {watchedType === "rider" &&
          <RiderStandingTable riderStandings={riderStandings}/>
        }
        {watchedType === "BMW" &&
          <RiderStandingTable riderStandings={riderBMWStandings}/>
        }
        {watchedType === "constructor" &&
          <ConstructorStandingTable constructorStandings={constructorStandings}/>
        }

        <div className="my-2 bg-white w-1/2 my-5">
          <div className="flex items-center space-x-2 px-2 py-3 cursor-pointer justify-between hover:text-red-600">
            <div className={'flex items-center space-x-2'}>
              <FilePdfOutlined/>
              <span className="uppercase text-xs font-semibold">Standing</span>
            </div>
            <ExportOutlined/>
          </div>
        </div>

        <div className="flex flex-col justify-center mt-16 bg-[#171c21] p-6 text-center items-center">
          <div className={"text-4xl text-white font-extrabold text-center mb-4"}>Get the official MotoGP™ Newsletter!
          </div>
          <div className={'text-white text-center mb-8'}>Create a MotoGP™ account now and gain access to exclusive
            content, such as the MotoGP™ Newsletter, which
            features GP Reports, incredible videos and other interesting information about our sport.
          </div>
          <div className={"bg-white w-40 text-center px-5 py-3 rounded-3xl font-semibold"}>SIGN UP FOR FREE</div>
        </div>
      </div>
    </div>
  );
};

export default Standing;