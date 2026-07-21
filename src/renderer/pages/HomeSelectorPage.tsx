import {
  FileTextOutlined,
  StockOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Space, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoOptica from '../../../assets/optica-josu-logo.png';
import { ROUTES } from '../app/constants';
import AdminLayout from '../layouts/AdminLayout';

const { Title, Text } = Typography;

const HomeSelectorPage: React.FC = () => {
  const navigate = useNavigate();

  const cardStyle = (gradient: string) => ({
    background: gradient,
    borderRadius: '14px',
    border: '1px solid #e5e7eb',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    cursor: 'pointer',
  });

  const sectionStyle = {
    marginBottom: 22,
    borderRadius: 16,
    background: '#fffdfd',
    padding: '0px 24px 0px 24px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 2px 8px rgba(166, 165, 165, 0.04)',
  };

  return (
    <AdminLayout>
      <div
        style={{
          maxWidth: '1200px',
          margin: '20px auto',
          padding: '0 20px',
        }}
      >
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ marginTop: '40px', marginBottom: '30px' }}>
            <img
              src={logoOptica}
              alt="Logo Óptica Josu"
              style={{
                width: '500px',
                height: 'auto',
                filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.05))',
              }}
            />
          </div>
        </header>

        <Card style={sectionStyle}>
          <Title level={4} style={{ marginTop: 0, marginBottom: 24 }}>
            👥 Gestión de Clientes
          </Title>

          <Row gutter={[24, 24]} justify="start">
            <Col xs={24} md={12} xl={8}>
              <Card
                hoverable
                className="option-card"
                style={cardStyle(
                  'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                )}
                onClick={() => navigate(ROUTES.CUSTOMERS_MANAGER)}
              >
                <Space direction="vertical" size="small">
                  <UsergroupAddOutlined
                    style={{ fontSize: '32px', color: '#0284c7' }}
                  />
                  <Title
                    level={3}
                    style={{ color: '#075985', margin: '10px 0 0 0' }}
                  >
                    Clientes
                  </Title>
                  <Text style={{ color: '#1e293b', fontWeight: 500 }}>
                    Gestión de clientes, graduaciones y pedidos.
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>

        <Card style={sectionStyle}>
          <Title level={4} style={{ marginTop: 0, marginBottom: 24 }}>
            📦 Inventarios
          </Title>

          <Row gutter={[24, 24]} justify="start">
            <Col xs={24} md={12} xl={8}>
              <Card
                hoverable
                className="option-card"
                style={cardStyle(
                  'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                )}
                onClick={() => navigate(ROUTES.STOCK_MONTURAS)}
              >
                <Space direction="vertical" size="small">
                  <StockOutlined
                    style={{ fontSize: '32px', color: '#475569' }}
                  />
                  <Title
                    level={3}
                    style={{ color: '#0f172a', margin: '10px 0 0 0' }}
                  >
                    Monturas
                  </Title>
                  <Text style={{ color: '#1e293b', fontWeight: 500 }}>
                    Stock de monturas.
                  </Text>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12} xl={8}>
              <Card
                hoverable
                className="option-card"
                style={cardStyle(
                  'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                )}
                onClick={() => navigate(ROUTES.STOCK_LENTES_LENTILLAS)}
              >
                <Space direction="vertical" size="small">
                  <StockOutlined
                    style={{ fontSize: '32px', color: '#475569' }}
                  />
                  <Title
                    level={3}
                    style={{ color: '#0f172a', margin: '10px 0 0 0' }}
                  >
                    Lentes y Lentillas
                  </Title>
                  <Text style={{ color: '#1e293b', fontWeight: 500 }}>
                    Stock de lentes y lentillas.
                  </Text>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12} xl={8}>
              <Card
                hoverable
                className="option-card"
                style={cardStyle(
                  'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)',
                )}
                onClick={() => navigate(ROUTES.STOCK_GENERICO)}
              >
                <Space direction="vertical" size="small">
                  <StockOutlined
                    style={{ fontSize: '32px', color: '#475569' }}
                  />
                  <Title
                    level={3}
                    style={{ color: '#0f172a', margin: '10px 0 0 0' }}
                  >
                    Productos Genéricos
                  </Title>
                  <Text style={{ color: '#1e293b', fontWeight: 500 }}>
                    Stock de productos genéricos.
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>

        <Card style={sectionStyle}>
          <Title level={4} style={{ marginTop: 0, marginBottom: 24 }}>
            📊 Administración
          </Title>

          <Row gutter={[24, 24]} justify="start">
            <Col xs={24} md={12} xl={8}>
              <Card
                hoverable
                className="option-card"
                style={cardStyle(
                  'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                )}
                onClick={() => navigate(ROUTES.PRESUPUESTO_GENERATOR)}
              >
                <Space direction="vertical" size="small">
                  <FileTextOutlined
                    style={{ fontSize: '32px', color: '#6e3415' }}
                  />
                  <Title
                    level={3}
                    style={{ color: '#6e3415', margin: '10px 0 0 0' }}
                  >
                    Presupuestos
                  </Title>
                  <Text style={{ color: '#6e3415', fontWeight: 500 }}>
                    Generación de presupuestos y facturas.
                  </Text>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12} xl={8}>
              <Card
                hoverable
                className="option-card"
                style={cardStyle(
                  'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
                )}
                onClick={() => navigate(ROUTES.STATISTICS)}
              >
                <Space direction="vertical" size="small">
                  <FileTextOutlined
                    style={{ fontSize: '32px', color: '#7b2b2b' }}
                  />
                  <Title
                    level={3}
                    style={{ color: '#7b2b2b', margin: '10px 0 0 0' }}
                  >
                    Estadísticas
                  </Title>
                  <Text style={{ color: '#1e293b', fontWeight: 500 }}>
                    Visualizador de estadísticas comerciales.
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default HomeSelectorPage;
