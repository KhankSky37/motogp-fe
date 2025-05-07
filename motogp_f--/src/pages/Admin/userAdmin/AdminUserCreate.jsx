import React, {useCallback, useEffect, useState} from 'react';
import {Button, Card, DatePicker, Form, Input, message, Select, Spin, Typography} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import UserService from '../../../services/UserService.jsx';
import RiderService from '../../../services/RiderService'; // Sẽ cần nếu muốn load danh sách Rider cho riderFavourite
import dayjs from 'dayjs'; // DatePicker của Antd tự xử lý dayjs object

const {Option} = Select;
const {Title} = Typography;

const GENDERS = [
  {value: 'MALE', label: 'Male'},
  {value: 'FEMALE', label: 'Female'},
  {value: 'OTHER', label: 'Other'},
];

const ROLES = [
  {value: 'USER', label: 'User'},
  {value: 'ADMIN', label: 'Admin'},
];

const AdminUserCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [riders, setRiders] = useState([]); // State để lưu danh sách riders nếu dùng Select

  useEffect(() => {
    const fetchRidersForSelect = async () => {
      try {
        const response = await RiderService.getAllRiders();
        setRiders(response.data.content || response.data);
      } catch (error) {
        console.error("Failed to fetch riders for select:", error);
        messageApi.error("Could not load riders for selection.");
      }
    };
    fetchRidersForSelect();
  }, [messageApi]);

  const onFinish = useCallback(async (values) => {
    setLoading(true);

    const userDto = {
      name: values.name,
      email: values.email,
      password: values.password, // Backend sẽ hash mật khẩu này
      surname: values.surname,
      nickname: values.nickname,
      gender: values.gender,
      dataOfBirth: values.dataOfBirth ? values.dataOfBirth.format('YYYY-MM-DD') : null,
      phoneNumber: values.phoneNumber,
      role: values.role,
      riderFavourite: values.riderFavouriteId ? {riderId: values.riderFavouriteId} : null,
    };

    try {
      await UserService.createUser(userDto);
      messageApi.success('User created successfully!');
      form.resetFields();
      // Điều hướng về trang danh sách với state chứa thông tin thành công
      navigate('/admin/users', {
        state: {successMessage: 'User created successfully!'},
      });
    } catch (error) {
      console.error('Failed to create user:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create user. Please try again.';
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [form, messageApi, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/admin/users');
  }, [navigate]);

  return (
    <Spin spinning={loading}>
      {contextHolder}
      <Card title={
        <div className="flex items-center">
          <Button type="text" icon={<ArrowLeftOutlined/>} onClick={handleCancel} className="mr-2" aria-label="Back"/>
          Create New User
        </div>
      }>
        <Form
          form={form}
          layout="horizontal"
          labelAlign="left"
          requiredMark="optional"
          labelCol={{span: 6}}
          wrapperCol={{span: 18}}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{required: true, message: 'Please input the full name!'}]}
          >
            <Input placeholder="Enter full name"/>
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {required: true, message: 'Please input the email!'},
              {type: 'email', message: 'The input is not valid E-mail!'}
            ]}
          >
            <Input placeholder="Enter email address"/>
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{required: true, message: 'Please input the password!'}]}
            hasFeedback // Hiển thị icon feedback khi nhập
          >
            <Input.Password placeholder="Enter password"/>
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']} // Phụ thuộc vào trường password
            hasFeedback
            rules={[
              {required: true, message: 'Please confirm your password!'},
              ({getFieldValue}) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm password"/>
          </Form.Item>

          <Form.Item name="surname" label="Surname">
            <Input placeholder="Enter surname (optional)"/>
          </Form.Item>

          <Form.Item name="nickname" label="Nickname">
            <Input placeholder="Enter nickname (optional)"/>
          </Form.Item>

          <Form.Item name="gender" label="Gender">
            <Select placeholder="Select gender (optional)" allowClear>
              {GENDERS.map(gender => (
                <Option key={gender.value} value={gender.value}>{gender.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="dataOfBirth" label="Date of Birth">
            <DatePicker style={{width: '100%'}} format="YYYY-MM-DD" placeholder="Select date of birth (optional)"/>
          </Form.Item>

          <Form.Item name="phoneNumber" label="Phone Number">
            <Input placeholder="Enter phone number (optional)"/>
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{required: true, message: 'Please select a role!'}]}
          >
            <Select placeholder="Select user role">
              {ROLES.map(role => (
                <Option key={role.value} value={role.value}>{role.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="riderFavouriteId" // Tên trường trong form
            label="Favourite Rider ID (Optional)"
            tooltip="Enter the ID of the user's favourite rider (e.g., VR46)"
          >
            <Select
              showSearch
              placeholder="Select favourite rider (optional)"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              allowClear
            >
              {riders.map(rider => (
                <Option key={rider.riderId} value={rider.riderId}
                        label={`${rider.firstName} ${rider.lastName} (${rider.riderId})`}>
                  {rider.firstName} {rider.lastName} ({rider.riderId})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{offset: 6, span: 18}} className={"border-t pt-4 mt-4"}>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
              <Button onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create User
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminUserCreate;