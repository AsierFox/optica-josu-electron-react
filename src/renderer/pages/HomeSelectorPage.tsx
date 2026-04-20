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
        <header style={{ textAlign: 'center', marginBottom: '80px' }}>
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

        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              className="custom-card"
              style={cardStyle(
                'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
              )}
              onClick={() => navigate(ROUTES.CLIENT_MANAGER)}
            >
              <Space direction="vertical" size="small">
                <UsergroupAddOutlined
                  style={{ fontSize: '32px', color: '#0284c7' }}
                />
                <Title
                  level={3}
                  style={{ color: '#075985', margin: '10px 0 0 0' }}
                >
                  Clientes y Graduaciones
                </Title>
                <Text style={{ color: '#1e293b', fontWeight: 500 }}>
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
                'linear-gradient(135deg, #daedff 0%, #9dceff 100%)',
              )}
              onClick={() => navigate(ROUTES.PRODUCT_STOCK)}
            >
              <Space direction="vertical" size="small">
                <StockOutlined style={{ fontSize: '32px', color: '#475569' }} />
                <Title
                  level={3}
                  style={{ color: '#0f172a', margin: '10px 0 0 0' }}
                >
                  Inventario
                </Title>
                <Text style={{ color: '#1e293b', fontWeight: 500 }}>
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
                'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
              )}
              onClick={() => navigate(ROUTES.STATISTICS)}
            >
              <Space direction="vertical" size="small">
                <FileTextOutlined
                  style={{ fontSize: '32px', color: '#4f46e5' }}
                />
                <Title
                  level={3}
                  style={{ color: '#3730a3', margin: '10px 0 0 0' }}
                >
                  Estadísticas
                </Title>
                <Text style={{ color: '#1e293b', fontWeight: 500 }}>
                  Visualizador de estadísticas comerciales.
                </Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              className="custom-card"
              style={cardStyle(
                'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
              )}
              onClick={() => navigate(ROUTES.PRESUPUESTO_GENERATOR)}
            >
              <Space direction="vertical" size="small">
                <FileTextOutlined
                  style={{ fontSize: '32px', color: '#ea580c' }}
                />
                <Title
                  level={3}
                  style={{ color: '#9a3412', margin: '10px 0 0 0' }}
                >
                  Presupuestos
                </Title>
                <Text style={{ color: '#1e293b', fontWeight: 500 }}>
                  Generación de presupuestos y facturas.
                </Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              className="custom-card"
              style={cardStyle(
                'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
              )}
              onClick={() => navigate(ROUTES.EXCEL_MANAGER)}
            >
              <Space direction="vertical" size="small">
                <FileExcelOutlined
                  style={{ fontSize: '32px', color: '#16a34a' }}
                />
                <Title
                  level={3}
                  style={{ color: '#166534', margin: '10px 0 0 0' }}
                >
                  Herramientas Excel
                </Title>
                <Text style={{ color: '#1e293b', fontWeight: 500 }}>
                  Importación y exportación masiva.
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
