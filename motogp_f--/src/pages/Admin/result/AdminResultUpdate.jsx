import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Form, InputNumber, Select, Spin, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import ResultService from "../../../services/ResultService.jsx";
import SessionService from "../../../services/SessionService.jsx";
import RiderService from "../../../services/RiderService.jsx";
import TeamService from "../../../services/TeamService.jsx";
import ManufacturerService from "../../../services/ManufacturerService.jsx";

const { Option } = Select;

const AdminResultUpdate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { resultId } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [riders, setRiders] = useState([]);
  const [teams, setTeams] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [ridersLoading, setRidersLoading] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [manufacturersLoading, setManufacturersLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch result data and options for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        setSessionsLoading(true);
        setRidersLoading(true);
        setTeamsLoading(true);
        setManufacturersLoading(true);

        // Fetch result data and dropdown options in parallel
        const [
          resultResponse,
          sessionsResponse,
          ridersResponse,
          teamsResponse,
          manufacturersResponse,
        ] = await Promise.all([
          ResultService.getResultById(resultId),
          SessionService.getAllSessions(),
          RiderService.getAllRiders(),
          TeamService.getAllTeams(),
          ManufacturerService.getAllManufacturers(),
        ]);

        // Set dropdown options
        setSessions(sessionsResponse.data);
        setRiders(ridersResponse.data);
        setTeams(teamsResponse.data);
        setManufacturers(manufacturersResponse.data);

        // Set form values from result data
        const resultData = resultResponse.data;
        form.setFieldsValue({
          sessionId: resultData.sessionId,
          riderId: resultData.rider?.riderId,
          teamId: resultData.team?.id,
          manufacturerId: resultData.manufacturer?.id,
          position: resultData.position,
          timeMillis: resultData.timeMillis,
          gapMillis: resultData.gapMillis,
          laps: resultData.laps,
          status: resultData.status,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        messageApi.error("Failed to load result data. Please try again.");
        navigate("/admin/results");
      } finally {
        setFetchLoading(false);
        setSessionsLoading(false);
        setRidersLoading(false);
        setTeamsLoading(false);
        setManufacturersLoading(false);
      }
    };

    if (resultId) {
      fetchData();
    }
  }, [resultId, form, messageApi, navigate]);

  const onFinish = useCallback(
    async (values) => {
      setLoading(true);

      try {
        // values từ Form đã chứa các trường như sessionId, riderId, teamId, manufacturerId
        // nếu các Form.Item có name tương ứng.
        // Chúng ta chỉ cần đảm bảo payload gửi đi có cấu trúc phẳng mà ResultDto ở backend mong đợi.
        const resultData = {
          ...values, // Giữ lại tất cả các giá trị từ form, bao gồm sessionId, riderId, etc.
        };

        // Không cần tạo các đối tượng lồng nhau như session: { id: ... }
        // và không cần xóa các ID ở cấp cao nhất nữa, vì backend ResultDto
        // (dựa trên ResultServiceImpl) mong đợi một trường String sessionId.

        await ResultService.updateResult(resultId, resultData);
        messageApi.success("Result updated successfully!", 0.5, () => {
          navigate("/admin/results");
        });
      } catch (error) {
        console.error("Failed to update result:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to update result. Please try again.";
        messageApi.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [resultId, messageApi, navigate]
  );

  const handleCancel = useCallback(() => {
    navigate("/admin/results");
  }, [navigate]);

  return (
    <Spin spinning={loading || fetchLoading}>
      {contextHolder}
      <Card
        title={
          <div className="flex items-center">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleCancel}
              className="mr-2"
              aria-label="Back"
            />
            Update Result
          </div>
        }
      >
        <Form
          form={form}
          layout="horizontal"
          labelAlign="left"
          requiredMark="optional"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
          autoComplete="off"
          disabled={fetchLoading}
        >
          <Form.Item
            name="sessionId"
            label="Session"
            rules={[{ required: true, message: "Please select a session!" }]}
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
            rules={[{ required: true, message: "Please select a rider!" }]}
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
            rules={[{ required: true, message: "Please select a team!" }]}
          >
            <Select
              placeholder="Select team"
              loading={teamsLoading}
              showSearch
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
              { required: true, message: "Please select a manufacturer!" },
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
            rules={[
              {
                type: "number",
                min: 1,
                message: "Position must be a positive number!",
              },
            ]}
          >
            <InputNumber
              placeholder="Enter position"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="timeMillis"
            label="Time (ms)"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Time must be a non-negative number!",
              },
            ]}
          >
            <InputNumber
              placeholder="Enter time in milliseconds"
              style={{ width: "100%" }}
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
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="laps"
            label="Laps"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Laps must be a non-negative number!",
              },
            ]}
          >
            <InputNumber
              placeholder="Enter number of laps"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select placeholder="Select status">
              <Option value="FINISHED">Finished</Option>
              <Option value="DNF">DNF (Did Not Finish)</Option>
              <Option value="DNS">DNS (Did Not Start)</Option>
              <Option value="DSQ">DSQ (Disqualified)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            wrapperCol={{ offset: 6, span: 18 }}
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
                Update Result
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminResultUpdate;
