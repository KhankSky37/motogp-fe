import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import CircuitService from "../../../services/CircuitService.jsx";
import { COUNTRIES } from "../../../constants/Countries.jsx";
import ImageUploadField from "../../../components/admin/shared/ImageUploadField.jsx";

const { Option } = Select;

const AdminCircuitEdit = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [circuit, setCircuit] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch circuit data on component mount
  useEffect(() => {
    const fetchCircuit = async () => {
      setLoading(true);
      try {
        const data = await CircuitService.getCircuitById(id);
        setCircuit(data);
        form.setFieldsValue({
          name: data.name,
          locationCity: data.locationCity,
          locationCountry: data.locationCountry,
          lengthKm: data.lengthKm,
        });
      } catch (error) {
        console.error("Failed to fetch circuit:", error);
        messageApi.error("Failed to load circuit data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCircuit();
    }
  }, [id, form, messageApi]);

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
        await CircuitService.updateCircuit(id, circuitDto, values.image);
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
    [id, messageApi, navigate]
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
            Edit Circuit
          </div>
        }
      >
        {circuit && (
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
              extra={
                circuit.imageUrl && (
                  <img
                    src={circuit.imageUrl}
                    alt={circuit.name}
                    className="mt-2"
                    style={{ maxWidth: "200px" }}
                  />
                )
              }
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
              rules={[
                { required: true, message: "Please select the country!" },
              ]}
            >
              <Select
                placeholder="Select country"
                allowClear
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
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
              <div className="flex justify-end space-x-2">
                <Button onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Circuit
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </Card>
    </Spin>
  );
};

export default AdminCircuitEdit;
