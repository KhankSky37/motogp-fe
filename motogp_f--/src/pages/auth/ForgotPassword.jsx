import React, {useState} from 'react';
import {Button, Form, Input, message, Steps, Typography} from 'antd';
import {LockOutlined, MailOutlined, SafetyOutlined} from '@ant-design/icons';
import {Link, useNavigate} from 'react-router-dom';
import motogpLogo from "../../assets/motogp1.jpg";
import UserService from "../../services/UserService.jsx"; // Adjust path as needed

const {Title, Text} = Typography;
const {Step} = Steps;

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [resetForm] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // Step 1: Send forgot password request
  const onFinishForgotPassword = async (values) => {
    setLoading(true);
    try {
      await UserService.forgotPassword({email: values.email});
      setEmail(values.email);
      messageApi.success('OTP has been sent to your email!');
      setCurrentStep(1);
    } catch (error) {
      console.error('Forgot password failed:', error);
      const errorMessage = error.response?.data || 'Failed to send reset email. Please try again.';
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password with OTP
  const onFinishResetPassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      messageApi.error('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const resetPasswordRequestDto = {
        otp: values.otp,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };

      await UserService.resetPassword(resetPasswordRequestDto);
      messageApi.success('Password reset successfully!');
      setCurrentStep(2);

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Reset password failed:', error);
      const errorMessage = error.response?.data || 'Failed to reset password. Please try again.';
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Enter Email',
      icon: <MailOutlined/>,
    },
    {
      title: 'Verify OTP',
      icon: <SafetyOutlined/>,
    },
    {
      title: 'Complete',
      icon: <LockOutlined/>,
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form
            form={form}
            name="forgot_password"
            onFinish={onFinishForgotPassword}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                {required: true, message: 'Please input your email!'},
                {type: 'email', message: 'Please enter a valid email!'},
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-500"/>}
                placeholder="Enter your email address"
                className="!bg-gray-50 !border-gray-300 !text-gray-700 placeholder-gray-400 focus:!border-red-500 focus:!ring-red-500"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full !bg-red-600 hover:!bg-red-700 !border-red-600 hover:!border-red-700 !text-white !font-semibold !tracking-wider"
                loading={loading}
              >
                SEND RESET CODE
              </Button>
            </Form.Item>
          </Form>
        );

      case 1:
        return (
          <Form
            form={resetForm}
            name="reset_password"
            onFinish={onFinishResetPassword}
            layout="vertical"
            size="large"
          >
            <Text className="block text-center text-gray-600 mb-4">
              We've sent a verification code to {email}
            </Text>

            <Form.Item
              name="otp"
              rules={[{required: true, message: 'Please input the OTP!'}]}
            >
              <Input
                prefix={<SafetyOutlined className="text-gray-500"/>}
                placeholder="Enter OTP code"
                className="!bg-gray-50 !border-gray-300 !text-gray-700 placeholder-gray-400 focus:!border-red-500 focus:!ring-red-500"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              rules={[
                {required: true, message: 'Please input your new password!'},
                {min: 6, message: 'Password must be at least 6 characters!'},
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-500"/>}
                placeholder="New Password"
                className="!bg-gray-50 !border-gray-300 !text-gray-700 placeholder-gray-400 focus:!border-red-500 focus:!ring-red-500"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                {required: true, message: 'Please confirm your new password!'},
                ({getFieldValue}) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-500"/>}
                placeholder="Confirm New Password"
                className="!bg-gray-50 !border-gray-300 !text-gray-700 placeholder-gray-400 focus:!border-red-500 focus:!ring-red-500"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full !bg-red-600 hover:!bg-red-700 !border-red-600 hover:!border-red-700 !text-white !font-semibold !tracking-wider"
                loading={loading}
              >
                RESET PASSWORD
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                type="link"
                onClick={() => setCurrentStep(0)}
                className="w-full !text-gray-600 hover:!text-red-500"
              >
                Back to email entry
              </Button>
            </Form.Item>
          </Form>
        );

      case 2:
        return (
          <div className="text-center">
            <div className="mb-4">
              <SafetyOutlined className="text-6xl text-green-500 mb-4"/>
            </div>
            <Title level={3} className="!text-green-600 !mb-2">Password Reset Successful!</Title>
            <Text className="text-gray-600 block mb-4">
              Your password has been successfully reset. You can now log in with your new password.
            </Text>
            <Button
              type="primary"
              onClick={() => navigate('/login')}
              className="!bg-red-600 hover:!bg-red-700 !border-red-600 hover:!border-red-700"
            >
              GO TO LOGIN
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {contextHolder}
      <div
        className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex flex-col justify-center items-center p-4 font-MGPText">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img
              src={motogpLogo}
              alt="MotoGP Logo"
              className="h-16 mx-auto mb-4"
            />
            <Title
              level={2}
              className="!text-white !font-extrabold tracking-tight font-MGPDisplay"
            >
              RESET PASSWORD
            </Title>
            <Text className="text-gray-400">
              Follow the steps to reset your MotoGP™ account password.
            </Text>
          </div>

          <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-xl p-8">
            {/* Steps indicator */}
            <div className="mb-8">
              <Steps current={currentStep} size="small">
                {steps.map((step, index) => (
                  <Step key={index} title={step.title} icon={step.icon}/>
                ))}
              </Steps>
            </div>

            {/* Step content */}
            {renderStepContent()}

            {currentStep < 2 && (
              <div className="text-center mt-6">
                <Text className="text-gray-600">
                  Remember your password?{' '}
                  <Link
                    to="/login"
                    className="!font-semibold !text-red-600 hover:!text-red-500"
                  >
                    Sign in
                  </Link>
                </Text>
              </div>
            )}
          </div>
        </div>

        <Text className="text-center text-gray-500 mt-12 text-xs">
          © {new Date().getFullYear()} Dorna Sports S.L. All rights reserved.
          MotoGP™ and VideoPass are trademarks of Dorna Sports S.L.
        </Text>
      </div>
    </>
  );
};

export default ForgotPassword;