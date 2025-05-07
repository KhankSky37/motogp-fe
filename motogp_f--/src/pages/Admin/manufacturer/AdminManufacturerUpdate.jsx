import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Spin,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import ManufacturerService from "../../../services/ManufacturerService.jsx";
import { COUNTRIES } from "../../../constants/Countries.jsx";
import ImageUploadField from "../../../components/admin/shared/ImageUploadField.jsx";
import { getImageUrl } from "../../../utils/urlHelpers.jsx";

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const AdminManufacturerUpdate = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [manufacturer, setManufacturer] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    const fetchManufacturer = async () => {
      setFetchLoading(true);
      try {
        const response = await ManufacturerService.getManufacturerById(id);
        const manufacturerData = response.data;
        setManufacturer(manufacturerData);
        setLogoUrl(
          manufacturerData.logoUrl
            ? getImageUrl(manufacturerData.logoUrl)
            : null
        );

        // Set form values
        form.setFieldsValue({
          name: manufacturerData.name,
          country: manufacturerData.country,
          foundedYear: manufacturerData.foundedYear,
          description: manufacturerData.description,
        });
      } catch (error) {
        console.error("Failed to fetch manufacturer details:", error);
        messageApi.error(
          "Failed to load manufacturer details. Please try again."
        );
        navigate("/admin/manufacturers");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchManufacturer();
    }
  }, [id, form, messageApi, navigate]);

  const onFinish = useCallback(
    async (values) => {
      setLoading(true);

      const manufacturerDto = {
        id: id,
        name: values.name,
        country: values.country,
        foundedYear: values.foundedYear,
        description: values.description,
      };

      try {
        await ManufacturerService.updateManufacturer(
          id,
          manufacturerDto,
          values.logo
        );
        messageApi.success("Manufacturer updated successfully!");
        navigate("/admin/manufacturers");
      } catch (error) {
        console.error("Failed to update manufacturer:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to update manufacturer. Please try again.";
        messageApi.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [id, messageApi, navigate]
  );

  const handleCancel = useCallback(() => {
    navigate("/admin/manufacturers");
  }, [navigate]);

  const currentYear = new Date().getFullYear();

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" tip="Loading manufacturer details..." />
      </div>
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
            Edit Manufacturer: {manufacturer?.name}
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
          <Form.Item name="logo" label="Manufacturer Logo">
            <ImageUploadField initialImageUrl={logoUrl} />
            <Text type="secondary" className="mt-1 block">
              Upload a new logo, or leave empty to keep the current one.
            </Text>
          </Form.Item>

          <Form.Item
            name="name"
            label="Manufacturer Name"
            rules={[
              {
                required: true,
                message: "Please enter the manufacturer name!",
              },
            ]}
          >
            <Input placeholder="Enter manufacturer name" />
          </Form.Item>

          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: "Please select the country!" }]}
          >
            <Select
              placeholder="Select country"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {COUNTRIES.map((country) => (
                <Option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="foundedYear"
            label="Founded Year"
            rules={[
              { required: true, message: "Please enter the founded year!" },
              {
                type: "number",
                min: 1800,
                max: currentYear,
                message: `Year must be between 1800 and ${currentYear}!`,
              },
            ]}
          >
            <InputNumber
              placeholder="Enter founded year"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Enter manufacturer description" />
          </Form.Item>

          <Form.Item
            wrapperCol={{ offset: 6, span: 18 }}
            className={"border-t pt-4 mt-4"}
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
                Update Manufacturer
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminManufacturerUpdate;
