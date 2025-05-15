import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Form, Input, Select, message, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import TeamService from "../../../services/TeamService.jsx";
import ManufacturerService from "../../../services/ManufacturerService.jsx";
import ImageUploadField from "../../../components/admin/shared/ImageUploadField.jsx";

const { Option } = Select;

const AdminTeamUpdate = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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

  // Fetch team data on component mount
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!id) return;
      setInitialLoading(true);
      try {
        const response = await TeamService.getTeamById(id);
        const teamData = response.data;

        // Set form values with the correct structure for ImageUploadField
        const formattedData = {
          ...teamData,
          logo: teamData.logoUrl || null,
          manufacturerId: teamData.manufacturer?.id,
        };

        form.setFieldsValue(formattedData);
      } catch (error) {
        console.error("Failed to fetch team data:", error);
        messageApi.error("Failed to load team data. Please try again.");
        navigate("/admin/teams");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchTeamData();
  }, [id, form, messageApi, navigate]);

  const onFinish = useCallback(
    async (values) => {
      setLoading(true);

      // Check if values.logo is a new File object or the initial URL string/null
      const logoFile = values.logo instanceof File ? values.logo : null;

      // Construct the DTO
      const teamDto = {
        id: id,
        name: values.name,
        manufacturer: values.manufacturerId
          ? { id: values.manufacturerId }
          : null,
        // logoUrl is handled by the backend based on whether a new file is sent
      };

      try {
        await TeamService.updateTeam(id, teamDto, logoFile);
        messageApi.success("Team updated successfully!");
        navigate("/admin/teams");
      } catch (error) {
        console.error("Failed to update team:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to update team. Please try again.";
        messageApi.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [id, messageApi, navigate]
  );

  const handleCancel = useCallback(() => {
    navigate("/admin/teams");
  }, [navigate]);

  if (initialLoading) {
    return (
      <Spin
        spinning={true}
        tip="Loading team data..."
        className="flex justify-center items-center h-64"
      />
    );
  }

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
            Update Team (ID: {id})
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
            rules={[{ required: false }]}
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
                Update Team
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminTeamUpdate;
