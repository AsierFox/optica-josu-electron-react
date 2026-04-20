import {
  FileTextOutlined,
  LineChartOutlined,
  ToolOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Menu, Typography } from 'antd';
import Sider from 'antd/es/layout/Sider';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../app/constants';
import { RootState } from '../app/store';

const { Title } = Typography;

const MenuSlider: React.FC = () => {
  const collapsed: boolean = useSelector(
    (state: RootState) => state.menuSlider.collapsed,
  );
  const navigate = useNavigate();
  const location = useLocation();

  const menuOptions = {
    [ROUTES.HOME]: {
      key: '1',
      label: 'HERRAMIENTAS',
    },
    [ROUTES.CLIENT_MANAGER]: {
      key: '2',
      label: 'Clientes',
    },
    [ROUTES.PRODUCT_STOCK]: {
      key: '3',
      label: 'Inventario',
    },
    [ROUTES.PRESUPUESTO_GENERATOR]: {
      key: '4',
      label: 'Presupuesto',
    },
    [ROUTES.STATISTICS]: {
      key: '5',
      label: 'Estadísticas',
    },
  };

  const getCurrentMenuSelection = () => {
    return menuOptions[location.pathname]?.key
      ? [menuOptions[location.pathname].key]
      : [''];
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        backgroundColor: '#001529',
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
      }}
    >
      <div
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          background: 'rgba(255, 255, 255, 0.04)',
          marginBottom: '16px',
        }}
      >
        <Title
          level={4}
          style={{
            margin: 0,
            background: 'linear-gradient(90deg, #40a9ff, #096dd9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 900,
            fontSize: collapsed ? '1.2rem' : '1.4rem',
            transition: 'all 0.3s',
          }}
        >
          {collapsed ? 'OJ' : 'Óptica Josu'}
        </Title>
      </div>

      <Menu
        theme="dark"
        defaultSelectedKeys={getCurrentMenuSelection()}
        items={[
          {
            key: menuOptions[ROUTES.HOME].key,
            icon: <ToolOutlined />,
            label: menuOptions[ROUTES.HOME].label,
            onClick: () => {
              navigate(ROUTES.HOME);
            },
          },
          {
            key: menuOptions[ROUTES.CLIENT_MANAGER].key,
            icon: <UsergroupAddOutlined />,
            label: menuOptions[ROUTES.CLIENT_MANAGER].label,
            onClick: () => {
              navigate(ROUTES.CLIENT_MANAGER);
            },
          },
          {
            key: menuOptions[ROUTES.PRODUCT_STOCK].key,
            icon: <LineChartOutlined />,
            label: menuOptions[ROUTES.PRODUCT_STOCK].label,
            onClick: () => {
              navigate(ROUTES.PRODUCT_STOCK);
            },
          },
          {
            key: menuOptions[ROUTES.PRESUPUESTO_GENERATOR].key,
            icon: <FileTextOutlined />,
            label: menuOptions[ROUTES.PRESUPUESTO_GENERATOR].label,
            onClick: () => {
              navigate(ROUTES.PRESUPUESTO_GENERATOR);
            },
          },
          {
            key: menuOptions[ROUTES.STATISTICS].key,
            icon: <FileTextOutlined />,
            label: menuOptions[ROUTES.STATISTICS].label,
            onClick: () => {
              navigate(ROUTES.STATISTICS);
            },
          },
        ]}
      />
    </Sider>
  );
};

export default MenuSlider;
