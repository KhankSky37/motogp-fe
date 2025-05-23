import React, { useCallback, useState, useEffect } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  message,
  Spin,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import TeamService from "../../../services/TeamService.jsx";
import ManufacturerService from "../../../services/ManufacturerService.jsx";
import ImageUploadField from "../../../components/admin/shared/ImageUploadField.jsx";

const { Option } = Select;

const AdminTeamCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [manufacturersLoading, setManufacturersLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch manufacturers for dropdown
  useEffect(() => {
    const fetchManufacturers = async () => {
      setManufacturersLoading(true);
      try {
        const response = await ManufacturerService.getAllManufacturers();
        setManufacturers(response.data);
      } catch (error) {
        console.error("Failed to fetch manufacturers:", error);
        messageApi.error("Failed to load manufacturers. Please try again.");
      } finally {
        setManufacturersLoading(false);
      }
    };

    fetchManufacturers();
  }, [messageApi]);

  const onFinish = useCallback(
    async (values) => {
      const logoFile = values.logo;
      setLoading(true);

      const teamDto = {
        name: values.name,
        manufacturer: values.manufacturerId
          ? { id: values.manufacturerId }
          : null,
      };

      try {
        await TeamService.createTeam(teamDto, logoFile);
        messageApi.success("Team created successfully!", 0.5, () => {
          form.resetFields();
          navigate("/admin/teams");
        });
      } catch (error) {
        console.error("Failed to create team:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to create team. Please try again.";
        messageApi.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [form, messageApi, navigate]
  );

  const handleCancel = useCallback(() => {
    navigate("/admin/teams");
  }, [navigate]);

  return (
    <Spin spinning={loading}>
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
            Create New Team
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
        >
          <Form.Item
            name="logo"
            label="Team Logo"
            rules={[{ required: false, message: "Please upload a team logo!" }]}
          >
            <ImageUploadField />
          </Form.Item>

          <Form.Item
            name="name"
            label="Team Name"
            rules={[{ required: true, message: "Please input the team name!" }]}
          >
            <Input placeholder="Enter team name" />
          </Form.Item>

          <Form.Item name="manufacturerId" label="Manufacturer">
            <Select
              placeholder="Select manufacturer"
              loading={manufacturersLoading}
              allowClear
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
                Create Team
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminTeamCreate;
