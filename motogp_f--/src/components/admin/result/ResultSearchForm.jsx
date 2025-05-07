import React, { useEffect, useState } from "react";
import { Form, Select, Button, Row, Col, Card, Input } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import SessionService from "../../../services/SessionService.jsx";
import RiderService from "../../../services/RiderService.jsx";
import TeamService from "../../../services/TeamService.jsx";
import ManufacturerService from "../../../services/ManufacturerService.jsx";

const { Option } = Select;

const ResultSearchForm = ({ onFinish, initialValues = {} }) => {
  const [form] = Form.useForm();
  const [sessions, setSessions] = useState([]);
  const [riders, setRiders] = useState([]);
  const [teams, setTeams] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilterData = async () => {
      setLoading(true);
      try {
        // Fetch all reference data needed for filters
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
        console.error("Failed to fetch filter data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  const handleReset = () => {
    form.resetFields();
  };

  const handleFinish = (values) => {
    onFinish(values);
  };

  return (
    <Card className="mb-4">
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={initialValues}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="sessionId" >
              <Select
                placeholder="Select session"
                allowClear
                loading={loading}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {sessions.map((session) => (
                  <Option key={session.id} value={session.id}>
                    {session.event?.name
                      ? `${session.event.name} - ${session.sessionType}`
                      : session.sessionType}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="riderId" >
              <Select
                placeholder="Select rider"
                allowClear
                loading={loading}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {riders.map((rider) => (
                  <Option key={rider.riderId} value={rider.riderId}>
                    {rider.firstName} {rider.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="teamId" >
              <Select
                placeholder="Select team"
                allowClear
                loading={loading}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {teams.map((team) => (
                  <Option key={team.id} value={team.id}>
                    {team.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="manufacturerId" >
              <Select
                placeholder="Select manufacturer"
                allowClear
                loading={loading}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {manufacturers.map((manufacturer) => (
                  <Option key={manufacturer.id} value={manufacturer.id}>
                    {manufacturer.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
              style={{ marginRight: 16 }}
            >
              Reset
            </Button>
            <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
              Search
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default ResultSearchForm;
