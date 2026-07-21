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
    [ROUTES.CUSTOMERS_MANAGER]: {
      key: '2',
      label: 'Clientes',
    },
    [ROUTES.STOCK_MONTURAS]: {
      key: '3',
      label: 'Monturas',
    },
    [ROUTES.STOCK_LENTES_LENTILLAS]: {
      key: '4',
      label: 'Lentes y Lentillas',
    },
    [ROUTES.STOCK_GENERICO]: {
      key: '5',
      label: 'Genérico',
    },
    [ROUTES.PRESUPUESTO_GENERATOR]: {
      key: '6',
      label: 'Presupuesto',
    },
    [ROUTES.STATISTICS]: {
      key: '7',
      label: 'Estadísticas',
    },
  };

  const getCurrentMenuSelection = () => {
    const getUrlFirstSegment = location.pathname
      .split('/')
      .slice(0, 2)
      .join('/');
    return menuOptions[getUrlFirstSegment]?.key
      ? [menuOptions[getUrlFirstSegment].key]
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
            key: menuOptions[ROUTES.CUSTOMERS_MANAGER].key,
            icon: <UsergroupAddOutlined />,
            label: menuOptions[ROUTES.CUSTOMERS_MANAGER].label,
            onClick: () => {
              navigate(ROUTES.CUSTOMERS_MANAGER);
            },
          },
          {
            key: 'stock',
            icon: <LineChartOutlined />,
            label: 'Inventarios',
            children: [
              {
                key: menuOptions[ROUTES.STOCK_MONTURAS].key,
                label: menuOptions[ROUTES.STOCK_MONTURAS].label,
                onClick: () => {
                  navigate(ROUTES.STOCK_MONTURAS);
                },
              },
              {
                key: menuOptions[ROUTES.STOCK_LENTES_LENTILLAS].key,
                label: menuOptions[ROUTES.STOCK_LENTES_LENTILLAS].label,
                onClick: () => {
                  navigate(ROUTES.STOCK_LENTES_LENTILLAS);
                },
              },
              {
                key: menuOptions[ROUTES.STOCK_GENERICO].key,
                label: menuOptions[ROUTES.STOCK_GENERICO].label,
                onClick: () => {
                  navigate(ROUTES.STOCK_GENERICO);
                },
              },
            ],
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
