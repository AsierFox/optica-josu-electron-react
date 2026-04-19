import {
  FileExcelOutlined,
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

  return (
    <AdminLayout>
      {/* Hover por CSS (evita bugs de estado) */}
      <style>{`
        .custom-card { transition: all 0.25s ease; }
        .custom-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.15);
        }
      `}</style>

      <div
        style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}
      >
        <header style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ marginTop: '40px', marginBottom: '30px' }}>
            <img
              src={logoOptica}
              alt="Logo Óptica Josu"
              style={{
                width: '350px',
                height: 'auto',
                filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.05))',
              }}
            />
          </div>
          <Title
            type="secondary"
            level={3}
            style={{ fontWeight: 300, letterSpacing: '0.5px' }}
          >
            Panel de Gestión Central
          </Title>
        </header>

        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              className="custom-card"
              style={cardStyle(
                'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              )}
              onClick={() => navigate(ROUTES.CLIENT_MANAGER)}
            >
              <Space direction="vertical" size="small">
                <UsergroupAddOutlined
                  style={{ fontSize: '32px', color: '#fff' }}
                />
                <Title
                  level={3}
                  style={{ color: '#fff', margin: '10px 0 0 0' }}
                >
                  Clientes y Graduaciones
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Gestión de expedientes y salud visual.
                </Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              className="custom-card"
              style={cardStyle(
                'linear-gradient(135deg, #334155 0%, #0f172a 100%)',
              )}
              onClick={() => navigate(ROUTES.PRODUCT_STOCK)}
            >
              <Space direction="vertical" size="small">
                <StockOutlined style={{ fontSize: '32px', color: '#fff' }} />
                <Title
                  level={3}
                  style={{ color: '#fff', margin: '10px 0 0 0' }}
                >
                  Inventario
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Stock de monturas, lentes y accesorios.
                </Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              className="custom-card"
              style={cardStyle(
                'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
              )}
              onClick={() => navigate(ROUTES.STATISTICS)}
            >
              <Space direction="vertical" size="small">
                <FileTextOutlined style={{ fontSize: '32px', color: '#fff' }} />
                <Title
                  level={3}
                  style={{ color: '#fff', margin: '10px 0 0 0' }}
                >
                  Estadísticas
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Visualizador de estadísticas.
                </Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              className="custom-card"
              style={cardStyle(
                'linear-gradient(135deg, #d97706 0%, #78350f 100%)',
              )}
              onClick={() => navigate(ROUTES.PRESUPUESTO_GENERATOR)}
            >
              <Space direction="vertical" size="small">
                <FileTextOutlined style={{ fontSize: '32px', color: '#fff' }} />
                <Title
                  level={3}
                  style={{ color: '#fff', margin: '10px 0 0 0' }}
                >
                  Presupuestos
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Generación de presupuestos.
                </Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              className="custom-card"
              style={cardStyle(
                'linear-gradient(135deg, #16a34a 0%, #14532d 100%)',
              )}
              onClick={() => navigate(ROUTES.EXCEL_MANAGER)}
            >
              <Space direction="vertical" size="small">
                <FileExcelOutlined
                  style={{ fontSize: '32px', color: '#fff' }}
                />
                <Title
                  level={3}
                  style={{ color: '#fff', margin: '10px 0 0 0' }}
                >
                  Herramientas Excel
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Importación y exportación de datos masivos.
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
