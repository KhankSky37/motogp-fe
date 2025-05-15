import React, { useCallback, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Spin,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CircuitService from "../../../services/CircuitService.jsx";
import { COUNTRIES } from "../../../constants/Countries.jsx";
import ImageUploadField from "../../../components/admin/shared/ImageUploadField.jsx";

const { Option } = Select;

const AdminCircuitCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = useCallback(
    async (values) => {
      setLoading(true);

      const circuitDto = {
        name: values.name,
        locationCity: values.locationCity,
        locationCountry: values.locationCountry,
        lengthKm: values.lengthKm,
      };

      try {
        await CircuitService.createCircuit(circuitDto, values.image);
        messageApi.success("Circuit created successfully!");
        form.resetFields();
        navigate("/admin/circuits");
      } catch (error) {
        console.error("Failed to create circuit:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to create circuit. Please try again.";
        messageApi.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [form, messageApi, navigate]
  );

  const handleCancel = useCallback(() => {
    navigate("/admin/circuits");
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
            Create New Circuit
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
            name="image"
            label="Circuit Image"
            rules={[
              { required: true, message: "Please upload a circuit image!" },
            ]}
          >
            <ImageUploadField />
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
              {COUNTRIES.map((country) => (
                <Option key={country.code} value={country.code}>
                  {country.name} ({country.code})
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
                Create Circuit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminCircuitCreate;
