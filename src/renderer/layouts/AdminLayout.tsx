import React from 'react';
import { Layout, theme } from 'antd';
import Header from '../components/Header';
import MenuSlider from '../components/MenuSlider';
import Footer from '../components/Footer';

const { Content } = Layout;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <MenuSlider />
      <Layout>
        <Header />

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
