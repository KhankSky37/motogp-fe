import React, {useState} from "react";
import {Button, Checkbox, Form, Input, message, Space, Typography} from "antd";
import {FacebookFilled, GithubOutlined, GoogleOutlined, LockOutlined, UserOutlined,} from "@ant-design/icons";
import motogpLogo from "../../assets/motogp1.jpg"; // Assuming you have a logo asset
import {Link, useNavigate} from "react-router-dom";
import UserService from "../../services/UserService.jsx";
import {jwtDecode} from "jwt-decode";
import AuthService from "../../services/AuthService.jsx"; // Import UserService

const {Title, Text} = Typography;
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();


  const onFinish = async (values) => {
    setLoading(true);
    try {
      const credentials = {
        email: values.email,
        password: values.password,
      };
      const response = await AuthService.login(credentials);
      const token = response.data;

      if (token && typeof token === 'string') {
        localStorage.setItem("motogp_token", token);
        const decodedToken = jwtDecode(token);
        const user = {
          id: decodedToken.userId, // Lấy từ claim "userId"
          email: decodedToken.sub,    // Lấy từ claim "sub" (subject)
          role: decodedToken.role,    // Lấy từ claim "role"
        };
        localStorage.setItem("motogp_user", JSON.stringify(user));

        messageApi.success("Login successful!");

        if (user.role?.toUpperCase() === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        // Xử lý trường hợp backend không trả về token hoặc trả về lỗi có cấu trúc khác
        const errorMessageFromServer = typeof response.data === 'string'
          ? response.data
          : (response.data?.message || response.data?.error || "Login failed: Invalid response from server.");
        messageApi.error(errorMessageFromServer);
      }
    } catch (error) {
      console.error("Login failed:", error);
      let errorMessage = "Login failed. Please check your credentials and try again.";
      if (error.response && error.response.data) {
        // Backend có thể trả về lỗi dạng string hoặc object
        errorMessage = typeof error.response.data === 'string'
          ? error.response.data
          : (error.response.data.error || error.response.data.message || errorMessage);
      }
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex flex-col justify-center items-center p-4">
      {contextHolder}
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
            WELCOME BACK, RIDER!
          </Title>
          <Text className="text-gray-400">
            Sign in to access your MotoGP™ account.
          </Text>
        </div>

        <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-xl p-8">
          <Form
            form={form}
            name="motogp_login"
            initialValues={{remember: true}}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
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
                  <UserOutlined className="site-form-item-icon text-gray-500"/>
                }
                placeholder="Email Address"
                className="!bg-gray-50 !border-gray-300 !text-gray-700 placeholder-gray-400 focus:!border-red-500 focus:!ring-red-500"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {required: true, message: "Please input your Password!"},
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined className="site-form-item-icon text-gray-500"/>
                }
                placeholder="Password"
                className="!bg-gray-50 !border-gray-300 !text-gray-700 placeholder-gray-400 focus:!border-red-500 focus:!ring-red-500"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-between items-center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="!text-gray-600">
                    <span className="text-gray-600">Remember me</span>
                  </Checkbox>
                </Form.Item>
                <Link to="/forgot-password" className="!text-red-600 hover:!text-red-500">
                  Forgot password?
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full !bg-red-600 hover:!bg-red-700 !border-red-600 hover:!border-red-700 !text-white !font-semibold !tracking-wider"
                loading={loading}
              >
                LOG IN
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
                  Or continue with
                </span>
              </div>
            </div>

            <Space className="mt-4 w-full" direction="vertical" size="middle">
              <Button
                icon={<GoogleOutlined/>}
                className="w-full !bg-white !text-gray-700 hover:!bg-gray-50 !border-gray-300 shadow-sm"
              >
                Sign in with Google
              </Button>
              <Button
                icon={<FacebookFilled/>}
                className="w-full !bg-blue-600 hover:!bg-blue-700 !text-white !border-blue-600 shadow-sm"
              >
                Sign in with Facebook
              </Button>
              <Button
                icon={<GithubOutlined/>}
                className="w-full !bg-gray-800 hover:!bg-black !text-white !border-gray-800 shadow-sm"
              >
                Sign in with GitHub
              </Button>
            </Space>
          </div>

          <Text className="block text-center text-gray-600 mt-8">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="!font-semibold !text-red-600 hover:!text-red-500"
            >
              Sign up
            </Link>
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

export default Login;