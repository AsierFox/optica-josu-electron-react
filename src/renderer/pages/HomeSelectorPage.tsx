import { FileTextOutlined, LineChartOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../app/constants';
import AdminLayout from '../layouts/AdminLayout';

const { Title, Text } = Typography;

const HomeSelectorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div style={{ margin: '60px auto', padding: '0 20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Title level={1} className="main-title">
            Panel de Control
          </Title>
          <Text type="secondary" style={{ fontSize: '18px', fontWeight: 400 }}>
            Selecciona una herramienta
          </Text>
        </header>

        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12}>
            <Card
              className="card-wrapper custom-hover-card"
              hoverable
              style={{
                background: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)',
              }}
              onClick={() => navigate(ROUTES.PRODUCT_STOCK)}
            >
              <Space direction="vertical" size="middle">
                <LineChartOutlined
                  style={{ fontSize: '40px', color: '#fff' }}
                />
                <Title level={4} style={{ color: '#fff', margin: 0 }}>
                  Inventario
                </Title>
                <Text className="card-wrapper-text">
                  Control de stock y productos
                </Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12}>
            <Card
              className="card-wrapper custom-hover-card"
              hoverable
              style={{
                background: 'linear-gradient(135deg, #722ed1 0%, #391085 100%)',
              }}
              onClick={() => navigate(ROUTES.PRESUPUESTO_GENERATOR)}
            >
              <Space direction="vertical" size="middle">
                <FileTextOutlined style={{ fontSize: '40px', color: '#fff' }} />
                <Title level={4} style={{ color: '#fff', margin: 0 }}>
                  Presupuestos
                </Title>
                <Text className="card-wrapper-text">
                  Generador de presupuestos
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default HomeSelectorPage;
