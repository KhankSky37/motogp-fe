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
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ManufacturerService from "../../../services/ManufacturerService.jsx";
import { COUNTRIES } from "../../../constants/Countries.jsx";

const { Option } = Select;
const { TextArea } = Input;

const AdminManufacturerCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = useCallback(
    async (values) => {
      setLoading(true);

      const manufacturerDto = {
        name: values.name,
        locationCountry: values.country, // Use locationCountry to match the field in database
      };

      try {
        console.log("Submitting manufacturer data:", manufacturerDto); // Debug log
        const response = await ManufacturerService.createManufacturer(
          manufacturerDto
        );

        console.log("Manufacturer creation response:", response); // Debug log

        if (response && (response.status === 200 || response.status === 201)) {
          messageApi.success("Manufacturer created successfully!");
          form.resetFields();

          // Điều hướng về trang danh sách với state chứa thông tin thành công
          // để trigger việc refresh danh sách
          navigate("/admin/manufacturers", {
            state: {
              success: true,
              message: "Manufacturer created successfully!",
            },
          });
        } else {
          throw new Error(
            "Failed to create manufacturer. Server returned: " + response.status
          );
        }
      } catch (error) {
        console.error("Failed to create manufacturer:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to create manufacturer. Please try again.";
        messageApi.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [form, messageApi, navigate]
  );

  const handleCancel = useCallback(() => {
    navigate("/admin/manufacturers");
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
            Create New Manufacturer
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
              {" "}
              {COUNTRIES.map((country) => (
                <Option key={country.code} value={country.code}>
                  {`${country.name} (${country.code})`}
                </Option>
              ))}
            </Select>
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
                Create Manufacturer
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminManufacturerCreate;
