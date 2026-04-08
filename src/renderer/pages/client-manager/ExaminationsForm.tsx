import { EyeOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Space,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import ExaminationModel from '../../../main/models/examination.mode';
import { NEW_ROW_ID_PREFIX } from '../../app/constants';
import utils from '../../utils/util';

const { Title, Text } = Typography;

interface Props {
  examination: ExaminationModel;
  isLastExamination: boolean;
  handleCancelNewExamination: () => void;
}

const ExaminationForm: React.FC<Props> = ({
  examination,
  isLastExamination,
  handleCancelNewExamination,
}) => {
  const DEFAULT_CARD_COLOR = '#8fe2c5';
  const [cardColor, setCardColor] = useState<string>(DEFAULT_CARD_COLOR);

  const [form] = Form.useForm();

  const getExaminationCardColor = () => {
    if (examination.id.toString().startsWith(NEW_ROW_ID_PREFIX)) {
      return '#7f1f5c';
    }
    if (isLastExamination) {
      return '#13c2c2';
    }
    return DEFAULT_CARD_COLOR;
  };

  const getExaminationBadgeText = () => {
    if (examination.id.toString().startsWith(NEW_ROW_ID_PREFIX)) {
      return 'Nueva';
    }
    if (isLastExamination) {
      return 'Actual';
    }
    return 'Previa';
  };

  useEffect(() => {
    setCardColor(getExaminationCardColor());
    form.setFieldsValue(examination);
    // TODO Revisar esto de incluir el form
  }, [form, examination]);

  return (
    <Form form={form} style={{ marginTop: 30 }}>
      {/* GRADUACIÓN ACTUAL - DESTACADA */}
      <Badge.Ribbon text={getExaminationBadgeText()} color={cardColor}>
        <Card
          title={
            <Space>
              <EyeOutlined color={cardColor} />
              <span>
                {utils.formatDateToYYYYMMDD(examination.updatedAt)} -{' '}
                {examination.idTypeExamination}
              </span>
            </Space>
          }
          style={{
            boxShadow: '0 4px 12px rgba(19, 194, 194, 0.15)',
            border: `1px solid ${cardColor}`,
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
                    <Form.Item name="odEsfera">
                      <Input placeholder="0.00" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Text strong>Cilindro</Text>
                    <Form.Item name="odCilindro">
                      <Input placeholder="0.00" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Text strong>Eje</Text>
                    <Form.Item name="odEje">
                      <Input placeholder="0°" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Text strong>Add</Text>
                    <Form.Item name="odADD">
                      <Input placeholder="0.00" />
                    </Form.Item>
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
                      <Form.Item name="odAV">
                        <Input size="small" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">VP</Text>
                      <Form.Item name="odVP">
                        <Input size="small" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">VL</Text>
                      <Form.Item name="odVL">
                        <Input size="small" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <Text strong>Queratomatría</Text>
                <Form.Item name="odQueratometria">
                  <Input placeholder="K1, K2..." />
                </Form.Item>
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

                    <Form.Item name="oiEsfera">
                      <Input placeholder="0.00" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Text strong>Cilindro</Text>
                    <Form.Item name="oiCilindro">
                      <Input placeholder="0.00" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Text strong>Eje</Text>
                    <Form.Item name="oiEje">
                      <Input placeholder="0°" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Text strong>Add</Text>
                    <Form.Item name="oiADD">
                      <Input placeholder="0.00" />
                    </Form.Item>
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
                      <Form.Item name="oiAV">
                        <Input size="small" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">VP</Text>
                      <Form.Item name="oiVP">
                        <Input size="small" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">VL</Text>
                      <Form.Item name="oiVL">
                        <Input size="small" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <Text strong>Queratomatría</Text>
                <Form.Item name="oiQueratometria">
                  <Input placeholder="K1, K2..." />
                </Form.Item>
              </Space>
            </Col>
          </Row>

          <Divider />
          <Row justify="center">
            <Col span={8} style={{ textAlign: 'center' }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Distancia Interpupilar (DIP)
              </Text>
              <Form.Item name="dip">
                <InputNumber
                  suffix="mm"
                  placeholder="64"
                  style={{ width: '120px' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="center">
            <Space size="large">
              <Button
                type="primary"
                icon={<SaveOutlined />}
                style={{
                  backgroundColor: cardColor,
                  borderColor: cardColor,
                  marginTop: 20,
                }}
              >
                Actualizar Graduación
              </Button>
              {examination.id.toString().startsWith(NEW_ROW_ID_PREFIX) && (
                <Popconfirm
                  title="¿Quieres cancelar esta nueva graduación?"
                  onConfirm={handleCancelNewExamination}
                >
                  <Button
                    type="default"
                    color="danger"
                    style={{
                      marginTop: 20,
                    }}
                  >
                    Cancelar Nueva Graduación
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </Row>
        </Card>
      </Badge.Ribbon>
    </Form>
  );
};

export default ExaminationForm;
