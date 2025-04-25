import React, {useState} from 'react';
import {Breadcrumb, Button, Layout} from 'antd';
import {Link, Outlet, useLocation} from "react-router-dom";
import {
  BellOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import AppMenu from "../components/admin/AppMenu.jsx";

const {Header, Content, Footer, Sider} = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const pathSnippets = location.pathname.split('/').filter(i => i);
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
    ...pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const isLast = index === pathSnippets.length - 1;
      const title = snippet.charAt(0).toUpperCase() + snippet.slice(1);
      return (
        <Breadcrumb.Item key={url}>
          {isLast ? title : <Link to={url}>{title}</Link>}
        </Breadcrumb.Item>
      );
    }),
  ];
  return (
    <Layout>
      <Sider style={{scrollbarWidth: 'thin'}} trigger={null}
             className='h-screen sticky top-0 left-0 overflow-auto'
             breakpoint="lg"
             collapsedWidth="70" collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div className={"text-white text-2xl font-bold text-center py-4 flex items-center justify-center"}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="MGP Icons/Helmet Line">
              <path id="Vector"
                    d="M33.7589 24.0529L33.7022 23.7711C32.6763 18.6563 32.161 16.0897 32.1563 16.0715C31.583 13.7718 30.316 11.8348 28.4926 10.47C26.8026 9.2048 24.6767 8.49109 22.5067 8.46072C19.8759 8.42369 17.3919 8.97887 15.1237 10.1104C13.3152 11.0126 11.6434 12.28 10.1548 13.8774C7.63188 16.5848 6.51484 19.2863 6.46854 19.4L6.17188 20.1285L10.2211 21.4666L11.5893 25.3048L32.3063 31.5059L33.733 25.5092C33.8474 25.0278 33.8563 24.5381 33.7589 24.0533V24.0529ZM32.3034 25.1685L31.2371 29.6507L12.7241 24.1096L11.9897 22.05L15.2522 23.1278L15.7134 21.7322L11.3645 20.2963L8.16817 19.24C8.64521 18.3055 9.63965 16.5866 11.2304 14.8792C12.5985 13.4111 14.1293 12.2489 15.7804 11.4255C17.8367 10.3996 20.0926 9.89628 22.4867 9.93035C24.3489 9.95665 26.1693 10.5659 27.6122 11.6466C28.8834 12.5981 29.8371 13.8815 30.4104 15.4L19.7208 14.2581C19.5652 14.2415 19.4226 14.24 19.2845 14.2541C18.6074 14.3222 18.0493 14.6974 17.7526 15.2833C17.4322 15.9163 17.4663 16.7063 17.8415 17.3474L20.0119 21.2011C20.8804 22.7433 22.3667 23.8592 24.09 24.2633L30.9497 25.8715L31.2852 24.4404L24.4256 22.8322C23.1019 22.5218 21.96 21.6644 21.293 20.48L19.1193 16.6204L19.1119 16.6078C18.9871 16.3963 18.9685 16.137 19.0645 15.9478C19.1341 15.8104 19.2545 15.7348 19.4322 15.717C19.4674 15.7133 19.5122 15.7144 19.5652 15.72L30.8304 16.9233C31.1189 18.3604 31.9222 22.3648 32.2626 24.0607L32.3193 24.3426C32.3745 24.6178 32.3697 24.8959 32.3045 25.1692L32.3034 25.1685Z"
                    fill="white"
                    stroke="currentColor"
                    stroke-width="1"
              >
              </path>
            </g>
          </svg>
          {collapsed ? "" : "MotoGP™"}
        </div>
        <AppMenu/>
      </Sider>
      <Layout>

        <Header className={"border border-gray-200 sticky top-0 z-10 p-0 bg-white"}>
          <div className='flex items-center justify-between pr-4 h-full'>
            <div className={"flex items-center "}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
              <Breadcrumb className={"font-medium"}>
                {breadcrumbItems}
              </Breadcrumb>
            </div>
            <div className={"text-xl flex items-center justify-end gap-4"}>
              <MailOutlined/>
              <BellOutlined/>
              <QuestionCircleOutlined/>
            </div>
          </div>
        </Header>

        <Content style={{margin: '24px 16px 0'}}>
          <div className={"p-4 min-h-[360px] bg-white rounded-lg"}>
            <Outlet/>
          </div>
        </Content>

        <Footer className='text-center font-medium text-gray-500'>
          MotoGP™ ©{new Date().getFullYear()} Created by AE NHOM 4
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;