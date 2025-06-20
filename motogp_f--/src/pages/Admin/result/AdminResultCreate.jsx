import React, {useCallback, useEffect, useState} from "react";
import {Button, Card, Form, InputNumber, message, Select, Spin} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import ResultService from "../../../services/ResultService.jsx";
import SessionService from "../../../services/SessionService.jsx";
import RiderService from "../../../services/RiderService.jsx";
import TeamService from "../../../services/TeamService.jsx";
import ManufacturerService from "../../../services/ManufacturerService.jsx";

const {Option} = Select;

const AdminResultCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [riders, setRiders] = useState([]);
  const [teams, setTeams] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [ridersLoading, setRidersLoading] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [manufacturersLoading, setManufacturersLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSessionsLoading(true);
        setRidersLoading(true);
        setTeamsLoading(true);
        setManufacturersLoading(true);

        const [
          sessionsResponse,
          ridersResponse,
          teamsResponse,
          manufacturersResponse,
        ] = await Promise.all([
          SessionService.getAllSessions(),
          RiderService.getAllRiders(),
          TeamService.getAllTeams(),
          ManufacturerService.getAllManufacturers(),
        ]);

        setSessions(sessionsResponse.data);
        setRiders(ridersResponse.data);
        setTeams(teamsResponse.data);
        setManufacturers(manufacturersResponse.data);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        messageApi.error("Failed to load data. Please refresh and try again.");
      } finally {
        setSessionsLoading(false);
        setRidersLoading(false);
        setTeamsLoading(false);
        setManufacturersLoading(false);
      }
    };

    fetchData();
  }, [messageApi]);

  const onFinish = useCallback(
    async (values) => {
      setLoading(true);

      try {
        const resultData = {
          ...values,
          rider: {riderId: values.riderId},
          team: {id: values.teamId},
          manufacturer: {id: values.manufacturerId},
        };

        await ResultService.createResult(resultData);
        messageApi.success("Result created successfully!", 0.5, () => {
          form.resetFields();
          navigate("/admin/results");
        });
      } catch (error) {
        console.error("Failed to create result:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to create result. Please try again.";
        messageApi.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [form, messageApi, navigate]
  );

  const handleCancel = useCallback(() => {
    navigate("/admin/results");
  }, [navigate]);

  const handleTeamChange = useCallback((teamId) => {
    const selectedTeam = teams.find(team => team.id === teamId);
    if (selectedTeam && selectedTeam.manufacturer) {
      form.setFieldsValue({
        manufacturerId: selectedTeam.manufacturer.id
      });
    }
  }, [teams, form]);

  return (
    <Spin spinning={loading}>
      {contextHolder}
      <Card
        title={
          <div className="flex items-center">
            <Button
              type="text"
              icon={<ArrowLeftOutlined/>}
              onClick={handleCancel}
              className="mr-2"
              aria-label="Back"
            />
            Create New Result
          </div>
        }
      >
        <Form
          form={form}
          layout="horizontal"
          labelAlign="left"
          requiredMark="optional"
          labelCol={{span: 6}}
          wrapperCol={{span: 18}}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="sessionId"
            label="Session"
            rules={[{required: true, message: "Please select a session!"}]}
          >
            <Select
              placeholder="Select session"
              loading={sessionsLoading}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {sessions.map((session) => (
                <Option key={session.id} value={session.id}>
                  {session.event?.name
                    ? `${session.event.name} - ${session.category?.name} -  ${session.sessionType}`
                    : session.sessionType}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="riderId"
            label="Rider"
            rules={[{required: true, message: "Please select a rider!"}]}
          >
            <Select
              placeholder="Select rider"
              loading={ridersLoading}
              showSearch
              optionLabelProp="label"
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            >
              {riders.map((rider) => (
                <Option
                  key={rider.riderId}
                  value={rider.riderId}
                  label={`${rider.firstName} ${rider.lastName}`}
                >
                  {rider.firstName} {rider.lastName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="teamId"
            label="Team"
            rules={[{required: true, message: "Please select a team!"}]}
          >
            <Select
              placeholder="Select team"
              loading={teamsLoading}
              showSearch
              onChange={handleTeamChange}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {teams.map((team) => (
                <Option key={team.id} value={team.id}>
                  {team.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="manufacturerId"
            label="Manufacturer"
            rules={[
              {required: true, message: "Please select a manufacturer!"},
            ]}
          >
            <Select
              placeholder="Select manufacturer"
              loading={manufacturersLoading}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {manufacturers.map((manufacturer) => (
                <Option key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="position"
            label="Position"
          >
            <InputNumber
              placeholder="Enter position"
              style={{width: "100%"}}
            />
          </Form.Item>

          <Form.Item
            name="timeMillis"
            label="Time (ms)"
          >
            <InputNumber
              placeholder="Enter time in milliseconds"
              style={{width: "100%"}}
            />
          </Form.Item>

          <Form.Item
            name="gapMillis"
            label="Gap (ms)"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Gap must be a non-negative number!",
              },
            ]}
          >
            <InputNumber
              placeholder="Enter gap in milliseconds"
              style={{width: "100%"}}
            />
          </Form.Item>

          <Form.Item
            name="laps"
            label="Laps"
          >
            <InputNumber
              placeholder="Enter number of laps"
              style={{width: "100%"}}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{required: true, message: "Please select a status!"}]}
          >
            <Select placeholder="Select status">
              <Option value="FINISHED">Finished</Option>
              <Option value="DNF">DNF (Did Not Finish)</Option>
              <Option value="DNS">DNS (Did Not Start)</Option>
              <Option value="DSQ">DSQ (Disqualified)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            wrapperCol={{offset: 6, span: 18}}
            className="border-t pt-4 mt-4"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Button onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Result
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminResultCreate;
