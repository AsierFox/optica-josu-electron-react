import { EyeOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Input, Row, Space, Typography } from 'antd';
import React from 'react';

const { Title, Text } = Typography;

const ExaminationForm: React.FC = () => {
  return (
    <>
      <Divider orientation="left">
        <EyeOutlined /> RX
      </Divider>
      <Card
        title={<span>{new Date().toLocaleDateString()} - Oftanmologo</span>}
        style={{ marginTop: 24, border: '1px solid #d9d9d9' }}
      >
        {/* CABECERA DE OJOS */}
        <Row gutter={24} style={{ marginBottom: 16, textAlign: 'center' }}>
          <Col span={11}>
            <Title level={5}>OJO DERECHO (OD)</Title>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Title level={5}>OJO IZQUIERDO (OI)</Title>
          </Col>
        </Row>

        {/* BLOQUE ESFERA, CILINDRO, EJE Y ADICIÓN */}
        <Row gutter={24}>
          {/* COLUMNA OD */}
          <Col span={11}>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <Row gutter={8}>
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
              <Row gutter={8}>
                <Col span={8}>
                  <Text size="small">AV</Text>
                  <Input size="small" />
                </Col>
                <Col span={8}>
                  <Text size="small">VP</Text>
                  <Input size="small" />
                </Col>
                <Col span={8}>
                  <Text size="small">VL</Text>
                  <Input size="small" />
                </Col>
              </Row>
              <Text type="secondary" size="small">
                Queratomatría
              </Text>
              <Input.TextArea rows={2} placeholder="K1, K2..." />
            </Space>
          </Col>

          {/* SEPARADOR VISUAL */}
          <Col
            span={2}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Divider type="vertical" style={{ height: '100%' }} />
          </Col>

          {/* COLUMNA OI */}
          <Col span={11}>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <Row gutter={8}>
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
              <Row gutter={8}>
                <Col span={8}>
                  <Text size="small">AV</Text>
                  <Input size="small" />
                </Col>
                <Col span={8}>
                  <Text size="small">VP</Text>
                  <Input size="small" />
                </Col>
                <Col span={8}>
                  <Text size="small">VL</Text>
                  <Input size="small" />
                </Col>
              </Row>
              <Text type="secondary" size="small">
                Queratomatría
              </Text>
              <Input.TextArea rows={2} placeholder="K1, K2..." />
            </Space>
          </Col>
        </Row>

        <Divider />

        {/* DATOS BINOCULARES */}
        <Row justify="center">
          <Col span={6}>
            <Text strong>DIP (Distancia Interpupilar)</Text>
            <Input suffix="mm" placeholder="64" />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ExaminationForm;
