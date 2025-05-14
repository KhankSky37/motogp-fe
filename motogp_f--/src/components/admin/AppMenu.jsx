import React from 'react';
import {ConfigProvider, Menu} from 'antd';
import {
  AppstoreOutlined,
  CalendarOutlined,
  FileTextOutlined,
  GlobalOutlined,
  ReadOutlined,
  TeamOutlined,
  ToolOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {Link, useLocation} from 'react-router-dom';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const menuItems = [
  getItem(<Link to="/admin/riders">Rider</Link>, 'riders', <UserOutlined/>),
  getItem(<Link to="/admin/teams">Team</Link>, 'teams', <TeamOutlined/>),
  getItem(<Link to="/admin/manufacturers">Manufacturer</Link>, 'manufacturers', <ToolOutlined/>),
  getItem(<Link to="/admin/contracts">Contract</Link>, 'contracts', <FileTextOutlined/>),
  getItem(<Link to="/admin/seasons">Season</Link>, 'seasons', <CalendarOutlined/>),
  getItem(<Link to="/admin/circuits">Circuit</Link>, 'circuits', <GlobalOutlined/>),
  getItem(<Link to="/admin/events">Event</Link>, 'events', <CalendarOutlined/>),
  getItem(<Link to="/admin/categories">Category</Link>, 'categories', <AppstoreOutlined/>),
  getItem(<Link to="/admin/sessions">Session</Link>, 'sessions', <CalendarOutlined/>),
  getItem(<Link to="/admin/results">Result</Link>, 'results', <TrophyOutlined/>),
  getItem(<Link to="/admin/news">News Article</Link>, 'news', <ReadOutlined/>),
  getItem(<Link to="/admin/users">User</Link>, 'users', <UserOutlined/>),
];

const AppMenu = () => {
  const location = useLocation();
  const currentKey = location.pathname.split('/')[2] || 'dashboard';

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            darkItemSelectedBg: '#8c8c8c',
          },
        },
      }}
    >
      <Menu
        selectedKeys={[currentKey]}
        mode="inline"
        items={menuItems}
        theme="dark"
      />
    </ConfigProvider>

  );
};

export default AppMenu;