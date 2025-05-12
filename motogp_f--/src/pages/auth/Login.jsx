import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Button, Checkbox, Divider, Form, Input, message} from 'antd';
import {EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined} from '@ant-design/icons';
// import AuthLayout from '../components/layout/AuthLayout';
// import { loginUser } from '../services/auth';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Trong ứng dụng thực tế, bạn sẽ gọi API đăng nhập ở đây
      // await loginUser(values.email, values.password);
      message.success('Đăng nhập thành công!');
      navigate('/dashboard');
    } catch (error) {
      message.error('Email hoặc mật khẩu không đúng');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Đăng nhập</h1>
          <p className="text-gray-400 mt-2">Truy cập tài khoản MotoGP của bạn</p>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          className="login-form"
        >
          <Form.Item
            name="email"
            label={<span className="text-white">Email</span>}
            rules={[
              {required: true, message: 'Vui lòng nhập email'},
              {type: 'email', message: 'Email không hợp lệ'}
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon"/>}
              placeholder="Email"
              size="large"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="text-white">Mật khẩu</span>}
            rules={[{required: true, message: 'Vui lòng nhập mật khẩu'}]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon"/>}
              placeholder="Mật khẩu"
              size="large"
              iconRender={visible => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </Form.Item>

          <div className="flex justify-between items-center mb-4">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-white">Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <Link to="/forgot-password" className="text-red-500 hover:text-red-400">
              Quên mật khẩu?
            </Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="w-full bg-red-600 hover:bg-red-700 border-red-600"
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Divider className="bg-gray-700">
            <span className="text-gray-400">hoặc</span>
          </Divider>

          <Button
            size="large"
            className="w-full border-gray-700 text-white hover:border-gray-600"
            onClick={() => navigate('/register')}
          >
            Tạo tài khoản
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Login;