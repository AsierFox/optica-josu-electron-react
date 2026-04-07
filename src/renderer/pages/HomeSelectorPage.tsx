import { FileTextOutlined, LineChartOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Row, Space, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../app/constants';
import AdminLayout from '../layouts/AdminLayout';
import logoOptica from '../../../assets/optica-josu-logo.png';

const { Title, Text } = Typography;

const HomeSelectorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div style={{ margin: '20px auto', padding: '0 20px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <img
            src={logoOptica}
            alt="Logo Óptica Josu"
            style={{
              width: '400px',
              height: 'auto',
              filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.1))',
            }}
          />
        </div>

        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={1} className="main-title">
            Panel de Control
          </Title>
          <Text type="secondary" style={{ fontSize: '18px', fontWeight: 400 }}>
            Selecciona una herramienta para comenzar
          </Text>
        </header>

        <Row gutter={[24, 24]} justify="center">
          {/* SECCIÓN CLIENTES - Azul Profesional */}
          <Col xs={24} sm={12} lg={8}>
            <Card
              className="card-wrapper custom-hover-card"
              hoverable
              style={{
                background: 'linear-gradient(135deg, #096dd9 0%, #003a8c 100%)',
                borderRadius: '12px',
              }}
              onClick={() => navigate(ROUTES.CLIENT_MANAGER)}
            >
              <Space direction="vertical" size="middle">
                <LineChartOutlined
                  style={{ fontSize: '40px', color: '#fff' }}
                />
                <Title level={4} style={{ color: '#fff', margin: 0 }}>
                  Clientes y Graduaciones
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                  Control de fichas y salud visual
                </Text>
              </Space>
            </Card>
          </Col>

          {/* SECCIÓN INVENTARIO - Verde Esmeralda / Teal (Más amable que el rojo) */}
          <Col xs={24} sm={12} lg={8}>
            <Card
              className="card-wrapper custom-hover-card"
              hoverable
              style={{
                background: 'linear-gradient(135deg, #13c2c2 0%, #006d75 100%)',
                borderRadius: '12px',
              }}
              onClick={() => navigate(ROUTES.PRODUCT_STOCK)}
            >
              <Space direction="vertical" size="middle">
                {/* Cambiado a icono de reporte/stock para no repetir el de arriba */}
                <FileTextOutlined style={{ fontSize: '40px', color: '#fff' }} />
                <Title level={4} style={{ color: '#fff', margin: 0 }}>
                  Inventario
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                  Stock de monturas y lentes
                </Text>
              </Space>
            </Card>
          </Col>

          {/* SECCIÓN PRESUPUESTOS - Violeta Tecnológico */}
          <Col xs={24} sm={12} lg={8}>
            <Card
              className="card-wrapper custom-hover-card"
              hoverable
              style={{
                background: 'linear-gradient(135deg, #722ed1 0%, #391085 100%)',
                borderRadius: '12px',
              }}
              onClick={() => navigate(ROUTES.PRESUPUESTO_GENERATOR)}
            >
              <Space direction="vertical" size="middle">
                <FileTextOutlined style={{ fontSize: '40px', color: '#fff' }} />
                <Title level={4} style={{ color: '#fff', margin: 0 }}>
                  Presupuestos
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                  Generador de presupuestos rápido
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
