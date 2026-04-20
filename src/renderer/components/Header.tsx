import {
  CalendarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { toggleMenu } from '../reducers/menuSliderReducer';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const collapsed: boolean = useSelector(
    (state: RootState) => state.menuSlider.collapsed,
  );

  return (
    <AntHeader
      style={{
        padding: '0 24px 0 0',
        background: 'linear-gradient(90deg, #001529 0%, #0c2b4a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #002140',
        height: 50,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => dispatch(toggleMenu(collapsed))}
        style={{ color: 'white', width: 64, height: 64, fontSize: '18px' }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <CalendarOutlined style={{ color: '#bae7ff', fontSize: '16px' }} />
        <span
          style={{
            color: '#bae7ff',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '1px',
          }}
        >
          {dayjs().format('dddd, D [de] MMMM [de] YYYY')}
        </span>
      </div>
    </AntHeader>
  );
};

export default Header;
