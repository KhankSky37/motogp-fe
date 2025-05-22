import React, {useCallback, useEffect, useState} from 'react';
import {Button, DatePicker, Form, Input, message, Select, Spin, Tabs} from 'antd';
import {useNavigate, useParams} from 'react-router-dom';
import UserService from '../../../services/UserService.jsx';
import RiderService from '../../../services/RiderService.jsx'; // Để load riders cho Select
import dayjs from 'dayjs';

const {Option} = Select;

const GENDERS = [
  {value: 'MALE', label: 'Male'},
  {value: 'FEMALE', label: 'Female'},
  {value: 'OTHER', label: 'Other'},
];

const ROLES = [
  {value: 'USER', label: 'User'},
  {value: 'ADMIN', label: 'Admin'},
];

const AdminUserUpdate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {id: userId} = useParams(); // Lấy userId từ URL
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const [passwordForm] = Form.useForm(); // Thêm form instance cho tab đổi mật khẩu

  // Fetch riders for selection
  useEffect(() => {
    const fetchRidersForSelect = async () => {
      setLoadingRiders(true);
      try {
        // Giả sử API getAllRiders không phân trang hoặc bạn lấy 1 lượng lớn
        const response = await RiderService.getAllRiders();
        setRiders(response.data.content || response.data); // Điều chỉnh tùy theo cấu trúc response
      } catch (error) {
        console.error("Failed to fetch riders for select:", error);
        messageApi.error("Could not load riders for selection.");
      } finally {
        setLoadingRiders(false);
      }
    };
    fetchRidersForSelect();
  }, [messageApi]);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      setInitialLoading(true);
      try {
        const response = await UserService.getUserById(userId);
        const userData = response.data;

        const formattedData = {
          ...userData,
          dataOfBirth: userData.dataOfBirth ? dayjs(userData.dataOfBirth, 'YYYY-MM-DD') : null,
          riderFavouriteId: userData.riderFavourite ? userData.riderFavourite.riderId : null,
        };
        form.setFieldsValue(formattedData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        messageApi.error('Failed to load user data. Please try again.');
        navigate('/admin/users');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchUserData();
  }, [userId, form, messageApi, navigate]);

  const onFinish = useCallback(async (values) => {
    setLoading(true);
    try {
      await UserService.updateUser(userId, values);
      messageApi.success('User updated successfully!');
      navigate('/admin/users', {
        state: {successMessage: 'User updated successfully!'},
      });
    } catch (error) {
      console.error('Failed to update user:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update user. Please try again.';
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [userId, messageApi, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/admin/users');
  }, [navigate]);

  if (initialLoading) {
    return <Spin spinning={true} tip="Loading user data..." className="flex justify-center items-center h-64"/>;
  }

  const onChangePassword = async (values) => {
    setLoading(true);
    try {
      const response = await UserService.changePassword(userId, values);
      console.log(response)
      messageApi.info(response.data);
      passwordForm.resetFields();
    } catch (error) {
      messageApi.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Spin spinning={loading}>
      {contextHolder}
      <Tabs defaultActiveKey="1" items={[
        {
          key: '1',
          label: 'Information',
          children:
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
                name="riderFavouriteId"
                label="Favourite Rider (Optional)"
              >
                <Select
                  showSearch
                  placeholder="Select favourite rider"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  allowClear
                  loading={loadingRiders}
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
                    Update User
                  </Button>
                </div>
              </Form.Item>
            </Form>,

        },
        {
          key: '2',
          label: 'Change password',
          children:
            <Form
              form={passwordForm}
              layout="horizontal"
              labelAlign="left"
              requiredMark="optional"
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              onFinish={onChangePassword}
              autoComplete="off"
            >
              <Form.Item
                name="oldPassword"
                label="Old Password"
                rules={[{required: true, message: 'Please input the old password!'}]}
                hasFeedback
              >
                <Input.Password placeholder="Enter old password"/>
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[{required: true, message: 'Please input the old password!'}]}
                tooltip="Leave blank if you don't want to change the password."
              >
                <Input.Password placeholder="Enter new password"/>
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={['newPassword']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please confirm your new password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two new passwords that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm new password" />
              </Form.Item>

              <Form.Item wrapperCol={{offset: 6, span: 18}} className={"border-t pt-4 mt-4"}>
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
                  <Button onClick={handleCancel} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Change password
                  </Button>
                </div>
              </Form.Item>
            </Form>,
        }
      ]}/>

      {/*</Card>*/}
    </Spin>
  );
};

export default AdminUserUpdate;