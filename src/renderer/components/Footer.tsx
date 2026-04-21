import { Layout } from 'antd';
import React from 'react';
import packageJson from '../../../package.json';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
  return (
    <AntFooter
      style={{
        textAlign: 'center',
        background: '#f0f2f5',
        color: '#8c8c8c',
        fontSize: '13px',
        borderTop: '1px solid #e8e8e8',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontWeight: 600, color: '#595959' }}>
          Centro Óptico Josu
        </span>
        <span style={{ color: '#d9d9d9' }}>|</span>
        <span>&copy; {new Date().getFullYear()}</span>
        <span style={{ color: '#d9d9d9' }}>|</span>
        <span>
          Desarrollado por{' '}
          <span style={{ color: '#1890ff', fontWeight: 500 }}>
            asiergonzalez1995@gmail.com
          </span>
        </span>
        <span style={{ color: '#d9d9d9' }}>|</span>
        <span style={{ color: '#686868' }}>version {packageJson.version}</span>
      </div>
    </AntFooter>
  );
};

export default Footer;
