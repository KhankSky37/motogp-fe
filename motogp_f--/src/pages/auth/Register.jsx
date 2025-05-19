import React, { useState } from "react"; // Import useState
import { Button, Checkbox, Form, Input, Space, Typography, message } from "antd"; // Import message
import {
  FacebookFilled,
  GithubOutlined,
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import motogpLogo from "../../assets/motogp1.jpg";
import { Link as RouterLink, useNavigate } from "react-router-dom"; // Import useNavigate
import UserService from "../../services/UserService.jsx"; // Import UserService

const { Title, Text, Link } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate(); // Initialize navigate
  const [form] = Form.useForm(); // if you need to interact with the form instance

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };

      const response = await UserService.register(userData);
      if (response.data && (response.data.id || response.status === 200 || response.status === 201)) {
        message.success("Registration successful! Please log in.");
        form.resetFields(); // Reset form fields
        navigate("/login"); // Redirect to login page
      } else {
        const errorMessageFromServer = typeof response.data === 'string' ? response.data : (response.data?.message || "Registration failed: Unexpected response from server.");
        message.error(errorMessageFromServer);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage =
        error.response?.data?.message || // If backend sends a specific error message
        (typeof error.response?.data === 'string' ? error.response.data : null) || // If backend sends a plain string error
        "Registration failed. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src={motogpLogo}
            alt="MotoGP Logo"
            className="h-16 mx-auto mb-4"
          />
          <Title
            level={2}
            className="!text-white !font-extrabold tracking-tight"
          >
            CREATE YOUR ACCOUNT
          </Title>
          <Text className="text-gray-400">
            Join the MotoGP™ community today!
          </Text>
        </div>

        <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-xl p-8">
          <Form
            form={form} // Pass form instance
            name="motogp_register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            initialValues={{ agreement: false }} // Optional: set initial value for agreement
          >
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your Full Name!",
                },
              ]}
            >
              <Input
                prefix={
                  <UserOutlined className="site-form-item-icon text-gray-500"/>
                }
                placeholder="Full Name"
                className="!bg-gray-50 !border-gray-300 !text-gray-700 placeholder-gray-400 focus:!border-red-500 focus:!ring-red-500"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your Email!",
                  type: "email",
                },
              ]}
            >
              <Input
                prefix={
                  <MailOutlined className="site-form-item-icon text-gray-500"/>
                }
                placeholder="Email Address"
                className="!bg-gray-50 !border-gray-300 !text-gray-700 placeholder-gray-400 focus:!border-red-500 focus:!ring-red-500"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {required: true, message: "Please input your Password!"},
                {min: 6, message: "Password must be at least 6 characters!"},
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={
                  <LockOutlined className="site-form-item-icon text-gray-500"/>
                }
                placeholder="Password"
                className="!bg-gray-50 !border-gray-300 !text-gray-700 placeholder-gray-400 focus:!border-red-500 focus:!ring-red-500"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {required: true, message: "Please confirm your Password!"},
                ({getFieldValue}) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined className="site-form-item-icon text-gray-500"/>
                }
                placeholder="Confirm Password"
                className="!bg-gray-50 !border-gray-300 !text-gray-700 placeholder-gray-400 focus:!border-red-500 focus:!ring-red-500"
              />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                        new Error("You must accept the terms and conditions")
                      ),
                },
              ]}
            >
              <Checkbox className="!text-gray-600">
                <span className="text-gray-600">I have read and agree to the</span>{" "}
                <Link href="#" className="!text-red-600 hover:!text-red-500">
                  Terms & Conditions
                </Link>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full !bg-red-600 hover:!bg-red-700 !border-red-600 hover:!border-red-700 !font-semibold !tracking-wider"
                loading={loading} // Add loading prop
              >
                REGISTER
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"/>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or register with
                </span>
              </div>
            </div>

            <Space className="mt-4 w-full" direction="vertical" size="middle">
              <Button
                icon={<GoogleOutlined/>}
                className="w-full !bg-white !text-gray-700 hover:!bg-gray-50 !border-gray-300 shadow-sm"
              >
                Sign up with Google
              </Button>
              <Button
                icon={<FacebookFilled/>}
                className="w-full !bg-blue-600 hover:!bg-blue-700 !text-white !border-blue-600 shadow-sm"
              >
                Sign up with Facebook
              </Button>
              <Button
                icon={<GithubOutlined/>}
                className="w-full !bg-gray-800 hover:!bg-black !text-white !border-gray-800 shadow-sm"
              >
                Sign up with GitHub {/* Changed from "Sign in" to "Sign up" */}
              </Button>
            </Space>
          </div>

          <Text className="block text-center text-gray-600 mt-8">
            Already have an account?{" "}
            <RouterLink
              to="/login"
              className="!font-semibold !text-red-600 hover:!text-red-400"
            >
              Log in
            </RouterLink>
          </Text>
        </div>
      </div>
      <Text className="text-center text-gray-500 mt-12 text-xs">
        © {new Date().getFullYear()} Dorna Sports S.L. All rights reserved.
        MotoGP™ and VideoPass are trademarks of Dorna Sports S.L.
      </Text>
    </div>
  );
};

export default Register;