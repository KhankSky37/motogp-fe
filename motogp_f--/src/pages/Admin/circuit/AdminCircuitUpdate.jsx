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
import CircuitService from "../../../services/CircuitService.jsx";
import { COUNTRIES } from "../../../constants/Countries.jsx";
import ImageUploadField from "../../../components/admin/shared/ImageUploadField.jsx";

const { Option } = Select;
const { Text } = Typography;

const AdminCircuitUpdate = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [circuit, setCircuit] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [initialImageUrl, setInitialImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchCircuit = async () => {
      setFetchLoading(true);
      try {
        const response = await CircuitService.getCircuitById(id);
        const circuitData = response.data;
        setCircuit(circuitData);

        // Save the image URL separately for ImageUploadField
        if (circuitData.imageUrl) {
          setInitialImageUrl(circuitData.imageUrl);
        }

        // Set form values - exclude image since we handle it separately
        form.setFieldsValue({
          name: circuitData.name,
          locationCity: circuitData.locationCity,
          locationCountry: circuitData.locationCountry,
          lengthKm: circuitData.lengthKm,
        });
      } catch (error) {
        console.error("Failed to fetch circuit details:", error);
        messageApi.error("Failed to load circuit details. Please try again.");
        navigate("/admin/circuits");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchCircuit();
    }
  }, [id, form, messageApi, navigate]);

  // Handle image change
  const handleImageChange = useCallback((newImageFile) => {
    console.log("Image changed:", newImageFile);
    setImageFile(newImageFile); // Save File object when a new image is selected
  }, []);

  const onFinish = useCallback(
    async (values) => {
      console.log("Form values:", values);
      console.log("Image file (separate state):", imageFile);

      setLoading(true);

      const circuitDto = {
        id: id,
        name: values.name,
        locationCity: values.locationCity,
        locationCountry: values.locationCountry,
        lengthKm: values.lengthKm,
      };

      console.log("Circuit DTO:", circuitDto);

      try {
        // Use imageFile from state instead of values.image
        const response = await CircuitService.updateCircuit(
          id,
          circuitDto,
          imageFile
        );
        console.log("Update response:", response);
        messageApi.success("Circuit updated successfully!", 0.5, () => {
          navigate("/admin/circuits");
        });
      } catch (error) {
        console.error("Failed to update circuit:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to update circuit. Please try again.";
        messageApi.error(errorMsg); 
      } finally {
        setLoading(false);
      }
    },
    [id, messageApi, navigate, imageFile]
  );

  const handleCancel = useCallback(() => {
    navigate("/admin/circuits");
  }, [navigate]);

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" tip="Loading circuit details..." />
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
            Edit Circuit: {circuit?.name}
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
          {/* Handle image upload as a custom form field */}
          <Form.Item label="Circuit Image">
            <ImageUploadField
              value={initialImageUrl}
              onChange={handleImageChange}
            />
            <Text type="secondary" className="mt-1 block">
              Upload a new image, or leave empty to keep the current one.
            </Text>
          </Form.Item>

          <Form.Item
            name="name"
            label="Circuit Name"
            rules={[
              { required: true, message: "Please enter the circuit name!" },
            ]}
          >
            <Input placeholder="Enter circuit name" />
          </Form.Item>

          <Form.Item
            name="locationCity"
            label="City"
            rules={[{ required: true, message: "Please enter the city!" }]}
          >
            <Input placeholder="Enter city" />
          </Form.Item>

          <Form.Item
            name="locationCountry"
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
              {" "}
              {COUNTRIES.map((country) => (
                <Option key={country.code} value={country.code}>
                  {`${country.name} (${country.code})`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="lengthKm"
            label="Length (km)"
            rules={[
              { required: true, message: "Please enter the circuit length!" },
              {
                type: "number",
                min: 0,
                message: "Length must be a positive number!",
              },
            ]}
          >
            <InputNumber
              placeholder="Enter circuit length in kilometers"
              style={{ width: "100%" }}
            />
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
                Update Circuit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminCircuitUpdate;
