import React, {useCallback, useEffect, useState} from 'react';
import {Avatar, Button, Card, DatePicker, Form, Input, Layout, Menu, message, Radio, Spin, Typography,} from 'antd';
import {HeartOutlined, KeyOutlined, LogoutOutlined, SolutionOutlined, UserOutlined,} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import UserService from '../../services/UserService.jsx';
import dayjs from 'dayjs';
import motogp from "../../assets/motogp1.jpg";
import sbk from "../../assets/sbk-logo-landscape-white.svg";

import {getImageUrl} from "../../utils/urlHelpers.jsx";
import {useAuth} from "../../contexts/AuthContext.jsx";

const {Sider, Content} = Layout;
const {Title, Text, Link} = Typography;

const GENDERS = [
  {label: 'Male', value: 'MALE'},
  {label: 'Female', value: 'FEMALE'},
  {label: 'Other', value: 'OTHER'},
];

const UserProfile = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState('personal-details');
  const [messageApi, contextHolder] = message.useMessage();
  const {user, logout, updateUser} = useAuth();


  const fetchUserData = useCallback(async () => {
    if (!user || !user.id) {
      messageApi.error('You are not logged in.');
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const response = await UserService.getUserById(user.id);
      const userData = response.data;
      setCurrentUser(userData);
      form.setFieldsValue({
        ...userData,
        dataOfBirth: userData.dataOfBirth ? dayjs(userData.dataOfBirth) : null,
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      messageApi.error('Failed to load your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [form, messageApi, navigate, user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const onFinishPersonalDetails = async (values) => {
    setUpdateLoading(true);
    try {
      const updatedUserData = {
        ...currentUser, // Preserve existing fields not in the form
        name: values.name,
        surname: values.surname,
        nickname: values.nickname,
        gender: values.gender,
        dataOfBirth: values.dataOfBirth ? values.dataOfBirth.format('YYYY-MM-DD') : null,
        phoneNumber: values.phoneNumber,
      };
      const response = await UserService.updateUser(currentUser.id, updatedUserData);
      setCurrentUser(response.data);
      updateUser(response.data);

      messageApi.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      messageApi.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const onChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      messageApi.error("New passwords do not match!");
      return;
    }
    setPasswordChangeLoading(true);
    try {
      await UserService.changePassword(currentUser.id, values);
      messageApi.success("Password changed successfully!");
      passwordForm.resetFields();
    } catch (error) {
      console.error("Failed to change password:", error);
      messageApi.error(error.response?.data?.message || "Failed to change password.");
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    {key: 'personal-details', icon: <SolutionOutlined/>, label: 'Personal details'},
    {key: 'my-favourite', icon: <HeartOutlined/>, label: 'My favourite'},
    {key: 'change-password', icon: <KeyOutlined/>, label: 'Change password'},
    {key: 'logout', icon: <LogoutOutlined/>, label: 'Logout', onClick: handleLogout},
  ];

  const renderContent = () => {
    if (loading && !currentUser) {
      return <div className="flex justify-center items-center h-full"><Spin size="large"/></div>;
    }
    if (!currentUser) {
      return <div className="text-center p-8">Could not load user profile.</div>;
    }

    switch (selectedKey) {
      case 'personal-details':
        // marginTop: '-40px',zIndex: 10}
        return (
          <Card title="Personal details" bordered={false} className={"mt-[-65px] z-10"}>
            <Text type="secondary" style={{display: 'block', marginBottom: 24}}>
              Basic information, such as name, birthday and country, for your Dorna account
            </Text>
            <Form form={form} layout="vertical" onFinish={onFinishPersonalDetails} initialValues={currentUser}>
              <Form.Item label="Email">
                <Input value={currentUser.email}
                       addonAfter={<Button type="link" size="small">Change Email</Button>}/>
              </Form.Item>
              <Form.Item name="name" label="Name">
                <Input placeholder="Your name"/>
              </Form.Item>
              <Form.Item name="surname" label="Surname">
                <Input placeholder="Your surname"/>
              </Form.Item>
              <Form.Item name="nickname" label="Nickname">
                <Input placeholder="Your nickname"/>
              </Form.Item>
              <Form.Item name="gender" label="Gender">
                <Radio.Group options={GENDERS}/>
              </Form.Item>
              <Form.Item name="dataOfBirth" label="Birth date">
                <DatePicker style={{width: '100%'}} format="DD/MM/YYYY" placeholder="dd/mm/yyyy"/>
              </Form.Item>
              <Form.Item name="phoneNumber" label="Phone number">
                <Input placeholder="Your phone number"/>
              </Form.Item>
              <Text type="secondary" style={{display: 'block', marginBottom: 16, fontSize: '12px'}}>
                We will use this data to send you commercial communications. For further information and to exercise
                your data protection rights, read the Privacy Policy. You can manage your preferences in the Preference
                Center.
              </Text>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={updateLoading} danger>
                  Save changes
                </Button>
              </Form.Item>
            </Form>
          </Card>
        );
      case 'change-password':
        return (
          <Card title="Change Password" className={"mt-[-65px] z-10"}>
            <Form form={passwordForm} layout="vertical" onFinish={onChangePassword}>
              <Form.Item
                name="oldPassword"
                label="Current Password"
                rules={[{required: true, message: 'Please input your current password!'}]}
              >
                <Input.Password placeholder="Current Password"/>
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[{required: true, message: 'Please input your new password!'}, {
                  min: 6,
                  message: 'Password must be at least 6 characters.'
                }]}
                hasFeedback
              >
                <Input.Password placeholder="New Password"/>
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={['newPassword']}
                hasFeedback
                rules={[
                  {required: true, message: 'Please confirm your new password!'},
                  ({getFieldValue}) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two new passwords that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm New Password"/>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={passwordChangeLoading} danger>
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        );
      // Add cases for other menu items here
      default:
        return <Card title={menuItems.find(item => item.key === selectedKey)?.label || "Section"}
                     className={"mt-[-65px] z-10"}><Text>Content for {selectedKey} coming soon.</Text></Card>;
    }
  };

  return (
    <>
      {contextHolder}
      <Layout style={{
        minHeight: 'calc(100vh - 64px)',
        background: '#f0f2f5'
      }}>
        <div style={{background: '#2b2d30', padding: '20px 0', height: '200px'}}
             className={"flex flex-col justify-center"}> {/* Removed space-y-4 */}
          <div className='mx-11 flex space-x-4 mb-4'>
            <img src={motogp} className={'h-6'}/>
            <img src={sbk} className={'h-6'}/>
          </div>
          <Title level={2} style={{color: 'white', textAlign: 'center', margin: 0}} className={"mt-4"}>MY
            ACCOUNT</Title>
        </div>
        <Layout>
          <Sider width={280} theme="light" style={{borderRight: '1px solid #e8e8e8', marginTop: '-40px', zIndex: 10}}
                 className={'rounded-r-lg'}>
            {loading && !currentUser ? (
              <div className="flex justify-center items-center h-40"><Spin/></div>
            ) : currentUser && (
              <div style={{textAlign: 'center', borderBottom: '1px solid #e8e8e8'}}
                   className={'flex space-x-2 px-6 py-4'}>
                <Avatar size={84} icon={<UserOutlined/>}
                        src={currentUser.photoUrl ? getImageUrl(currentUser.photoUrl) : null}
                        className={'border-[10px] border-gray-300'}/>
                <Title level={5} style={{
                  marginTop: 12,
                  marginBottom: 4
                }}>Hello {currentUser.name || currentUser.nickname || 'User'}<br/>
                  <span className={'text-gray-400'}>{new Date().toDateString()}</span>
                </Title>
                <Text type="secondary" style={{fontSize: '12px'}}>
                </Text>
              </div>
            )}
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={({key}) => {
                if (key === 'logout') {
                  handleLogout();
                } else {
                  setSelectedKey(key);
                }
              }}
              items={menuItems}
              style={{borderRight: 0, paddingTop: 10}}
            />
          </Sider>
          <Content style={{padding: '24px 48px', background: '#f5f5f5'}}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default UserProfile;