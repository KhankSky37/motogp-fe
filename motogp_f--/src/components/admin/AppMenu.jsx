import React, { useState } from 'react';
import { Menu } from 'antd';
import {
  AppstoreOutlined, // Ví dụ: Category
  GlobalOutlined, // Ví dụ: Circuit
  CalendarOutlined, // Ví dụ: Event, Season, Session
  ToolOutlined, // Ví dụ: Manufacturer
  ReadOutlined, // Ví dụ: NewsArticle
  TrophyOutlined, // Ví dụ: Result
  UserOutlined, // Ví dụ: Rider, User
  TeamOutlined, // Ví dụ: Team
  FileTextOutlined, // Ví dụ: Contract
  // Thêm các icon khác nếu cần
} from '@ant-design/icons';
import { Link } from 'react-router-dom'; // Giả sử bạn dùng React Router

// Helper function để tạo menu item dễ dàng hơn
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

// Danh sách các mục menu dựa trên yêu cầu của bạn
// Key thường là đường dẫn hoặc một định danh duy nhất
const menuItems = [
  getItem(<Link to="/admin/categories">Category</Link>, 'categories', <AppstoreOutlined />),
  getItem(<Link to="/admin/circuits">Circuit</Link>, 'circuits', <GlobalOutlined />),
  getItem(<Link to="/admin/events">Event</Link>, 'events', <CalendarOutlined />),
  getItem(<Link to="/admin/manufacturers">Manufacturer</Link>, 'manufacturers', <ToolOutlined />),
  getItem(<Link to="/admin/news">News Article</Link>, 'news', <ReadOutlined />), // Đổi tên thành News Article cho rõ ràng
  getItem(<Link to="/admin/results">Result</Link>, 'results', <TrophyOutlined />),
  getItem(<Link to="/admin/riders">Rider</Link>, 'riders', <UserOutlined />),
  getItem(<Link to="/admin/seasons">Season</Link>, 'seasons', <CalendarOutlined />),
  getItem(<Link to="/admin/sessions">Session</Link>, 'sessions', <CalendarOutlined />),
  getItem(<Link to="/admin/teams">Team</Link>, 'teams', <TeamOutlined />),
  getItem(<Link to="/admin/users">User</Link>, 'users', <UserOutlined />),
  getItem(<Link to="/admin/contracts">Contract</Link>, 'contracts', <FileTextOutlined />),
];

const AppMenu = () => {
  const [current, setCurrent] = useState('categories'); // Mục được chọn mặc định (ví dụ)

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
    // Thêm logic xử lý khi click menu item (ví dụ: điều hướng)
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="inline" // hoặc "horizontal"
      items={menuItems}
      theme="dark" // Tùy chọn theme
    />
  );
};

export default AppMenu;