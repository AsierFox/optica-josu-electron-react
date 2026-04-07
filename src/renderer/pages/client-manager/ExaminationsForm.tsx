import {
  EyeOutlined,
  HistoryOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Input,
  InputNumber,
  Row,
  Space,
  Typography,
} from 'antd';
import React from 'react';

const { Title, Text } = Typography;

const ExaminationForm: React.FC = () => {
  return (
    <div style={{ marginTop: 30 }}>
      <div style={{ marginBottom: '20px' }}>
        <Title level={3} style={{ marginBottom: '15px' }}>
          <HistoryOutlined /> Historial de Graduaciones
        </Title>

        <Button
          type="dashed"
          icon={<PlusOutlined />}
          style={{ borderColor: '#13c2c2', color: '#13c2c2' }}
        >
          Nueva Graduación
        </Button>
      </div>

      {/* GRADUACIÓN ACTUAL - DESTACADA */}
      <Badge.Ribbon text="Actual" color="#13c2c2">
        <Card
          className="current-exam-card"
          title={
            <Space>
              <EyeOutlined style={{ color: '#13c2c2' }} />
              <span>{new Date().toLocaleDateString()} - Examen Principal</span>
            </Space>
          }
          style={{
            boxShadow: '0 4px 12px rgba(19, 194, 194, 0.15)',
            border: '1px solid #13c2c2',
            borderRadius: '8px',
          }}
        >
          <Row gutter={24} style={{ textAlign: 'center', marginBottom: 20 }}>
            <Col span={12}>
              <div
                style={{
                  background: '#e6fffb',
                  padding: '8px',
                  borderRadius: '4px',
                }}
              >
                <Title level={5} style={{ margin: 0, color: '#006d75' }}>
                  OJO DERECHO (OD)
                </Title>
              </div>
            </Col>
            <Col span={12}>
              <div
                style={{
                  background: '#f0f5ff',
                  padding: '8px',
                  borderRadius: '4px',
                }}
              >
                <Title level={5} style={{ margin: 0, color: '#003a8c' }}>
                  OJO IZQUIERDO (OI)
                </Title>
              </div>
            </Col>
          </Row>

          <Row gutter={48}>
            {/* OJO DERECHO */}
            <Col span={11}>
              <Space
                direction="vertical"
                style={{ width: '100%' }}
                size="large"
              >
                <Row gutter={[12, 12]}>
                  <Col span={6}>
                    <Text strong>Esfera</Text>
                    <Input placeholder="0.00" />
                  </Col>
                  <Col span={6}>
                    <Text strong>Cilindro</Text>
                    <Input placeholder="0.00" />
                  </Col>
                  <Col span={6}>
                    <Text strong>Eje</Text>
                    <Input placeholder="0°" />
                  </Col>
                  <Col span={6}>
                    <Text strong>Add</Text>
                    <Input placeholder="0.00" />
                  </Col>
                </Row>
                <div
                  style={{
                    background: '#fafafa',
                    padding: '12px',
                    borderRadius: '8px',
                  }}
                >
                  <Row gutter={12}>
                    <Col span={8}>
                      <Text type="secondary">AV</Text>
                      <Input size="small" />
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">VP</Text>
                      <Input size="small" />
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">VL</Text>
                      <Input size="small" />
                    </Col>
                  </Row>
                </div>
                <Text strong>Queratomatría</Text>
                <Input placeholder="K1, K2..." />
              </Space>
            </Col>

            <Col span={2} style={{ display: 'flex', justifyContent: 'center' }}>
              <Divider
                type="vertical"
                style={{ height: '100%', borderLeft: '2px solid #f0f0f0' }}
              />
            </Col>

            {/* OJO IZQUIERDO */}
            <Col span={11}>
              <Space
                direction="vertical"
                style={{ width: '100%' }}
                size="large"
              >
                <Row gutter={[12, 12]}>
                  <Col span={6}>
                    <Text strong>Esfera</Text>
                    <Input placeholder="0.00" />
                  </Col>
                  <Col span={6}>
                    <Text strong>Cilindro</Text>
                    <Input placeholder="0.00" />
                  </Col>
                  <Col span={6}>
                    <Text strong>Eje</Text>
                    <Input placeholder="0°" />
                  </Col>
                  <Col span={6}>
                    <Text strong>Add</Text>
                    <Input placeholder="0.00" />
                  </Col>
                </Row>
                <div
                  style={{
                    background: '#fafafa',
                    padding: '12px',
                    borderRadius: '8px',
                  }}
                >
                  <Row gutter={12}>
                    <Col span={8}>
                      <Text type="secondary">AV</Text>
                      <Input size="small" />
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">VP</Text>
                      <Input size="small" />
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">VL</Text>
                      <Input size="small" />
                    </Col>
                  </Row>
                </div>
                <Text strong>Queratomatría</Text>
                <Input placeholder="K1, K2..." />
              </Space>
            </Col>
          </Row>

          <Divider />
          <Row justify="center">
            <Col span={8} style={{ textAlign: 'center' }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Distancia Interpupilar (DIP)
              </Text>
              <InputNumber
                suffix="mm"
                placeholder="64"
                style={{ width: '120px' }}
              />
            </Col>
          </Row>
          <Row justify="center">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              style={{
                backgroundColor: '#13c2c2',
                borderColor: '#13c2c2',
                marginTop: 20,
              }}
            >
              Actualizar Graduación
            </Button>
          </Row>
        </Card>
      </Badge.Ribbon>
    </div>
  );
};

export default ExaminationForm;
