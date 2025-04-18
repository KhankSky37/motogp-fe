import React from 'react';
import {Breadcrumb, Layout, Menu, theme} from 'antd';
import {Outlet} from "react-router-dom";
import motogp from "../assets/motogp1.jpg";

const {Header, Content, Footer} = Layout;


const DefaultLayout = () => {
const items =[
  {
    key:'calendar',
    label:'calendar',
  },
  {
    key:'Results&Standings',
    label:'Results & Standings',
  },
  {
    key:'Riders&Teams',
    label:'Riders & Teams',
  },
  {
    key:'VideoPass',
    label:'VideoPass',
  },
  {
    key:'Videos',
    label:'Videos',
  },
  {
    key:'News',
    label:'News',
  },
]
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();
  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
        className={"bg-black"}
      >

        <img src={motogp} alt="MotoGP Logo" style={{height: 40, marginRight: 16, width: 200}}/>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{flex: 1, minWidth: 0}}
          className="text-white font-medium bg-black"
        />

        <div className={"text-[#e5e7eb] divide-x-2"}>
          <span className={'px-2'}>Login</span>
          <span className={'px-2'}>Register</span>
        </div>
      </Header>
      <Content
        // style={{padding: '0 48px'}}
      >
        {/*<Breadcrumb style={{margin: '16px 0'}}>*/}
        {/*  <Breadcrumb.Item>Home</Breadcrumb.Item>*/}
        {/*  <Breadcrumb.Item>List</Breadcrumb.Item>*/}
        {/*  <Breadcrumb.Item>App</Breadcrumb.Item>*/}
        {/*</Breadcrumb>*/}
        {/*<div*/}
        {/*  style={{*/}
        {/*    padding: 24,*/}
        {/*    minHeight: 380,*/}
        {/*    // background: colorBgContainer,*/}
        {/*    borderRadius: borderRadiusLG,*/}
        {/*  }}*/}
        {/*  className={"bg-[#fafcff]"}*/}
        {/*>*/}
        {/*  Content*/}
        {/*</div>*/}
        <Outlet/>
      </Content>
      <Footer className={"px-12 py-4 border-t"}>
        ©{new Date().getFullYear()} Dorna Sports SL. All rights reserved. All trademarks are the property of their
        respective owners.
      </Footer>
    </Layout>
  );
};
export default DefaultLayout;