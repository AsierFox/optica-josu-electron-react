import {
  DeleteOutlined,
  EyeOutlined,
  SaveOutlined,
  StopOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import ExaminationModel from '../../../main/models/examination.model';
import ExaminationTypeModel from '../../../main/models/examinationType.model';
import { NEW_ROW_ID_PREFIX } from '../../app/constants';

const { Title, Text } = Typography;

interface Props {
  examination: ExaminationModel;
  examinationTypes: ExaminationTypeModel[];
  isLastExamination: boolean;
  onSaveExamination: (examination: ExaminationModel) => void;
  onDeleteExamination: (examinationId: string) => void;
}

const ExaminationFormPage: React.FC<Props> = ({
  examination,
  examinationTypes,
  isLastExamination,
  onSaveExamination,
  onDeleteExamination,
}) => {
  const DEFAULT_CARD_COLOR = '#71bca2';
  const isNewExamination = examination.id
    .toString()
    .startsWith(NEW_ROW_ID_PREFIX);

  const [cardColor, setCardColor] = useState<string>(DEFAULT_CARD_COLOR);

  const [form] = Form.useForm();

  const getExaminationBadgeText = () => {
    if (isNewExamination) {
      return 'Nueva';
    }
    if (isLastExamination) {
      return 'Actual';
    }
    return 'Previa';
  };

  const handleSaveExamination = (values: any) => {
    const updatedExamination = {
      ...examination,
      ...values,
      examinationDate: values.examinationDate?.format('YYYY-MM-DD'),
    };

    onSaveExamination(updatedExamination);
  };

  useEffect(() => {
    const getExaminationCardColor = () => {
      if (isNewExamination) {
        return '#7f1f5c';
      }
      if (isLastExamination) {
        return '#13c2c2';
      }
      return DEFAULT_CARD_COLOR;
    };

    setCardColor(getExaminationCardColor());

    form.setFieldsValue({
      ...examination,
      // Convertimos la fecha al formato que entiende el DatePicker
      examinationDate: examination.examinationDate
        ? dayjs(examination.examinationDate)
        : null,
    });
  }, [form, examination, isNewExamination, isLastExamination]);

  return (
    <Form
      form={form}
      onFinish={handleSaveExamination}
      style={{ marginTop: 30 }}
    >
      {/* GRADUACIÓN ACTUAL - DESTACADA */}
      <Badge.Ribbon text={getExaminationBadgeText()} color={cardColor}>
        <Card
          title={
            <Space>
              <EyeOutlined color={cardColor} />
              <span>
                <Space split={<span>-</span>} align="center">
                  <Form.Item name="examinationDate" noStyle>
                    <DatePicker
                      format="DD-MM-YYYY"
                      placeholder="Seleccionar fecha"
                    />
                  </Form.Item>

                  <Form.Item name="idExaminationType" noStyle>
                    <Select
                      style={{ width: '150px' }} // Ajusta el ancho según te convenga
                      defaultValue={
                        examinationTypes.find(
                          (ex) => ex.id === examination.idExaminationType,
                        )?.type
                      }
                      options={examinationTypes.map((exType) => ({
                        label: exType.type,
                        value: exType.id,
                      }))}
                    />
                  </Form.Item>
                </Space>
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
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Text strong>Cilindro</Text>
                    <Form.Item name="odCilindro">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Text strong>Eje</Text>
                    <Form.Item name="odEje">
                      <Input suffix="º" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Text strong>Add</Text>
                    <Form.Item name="odADD">
                      <Input />
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
                <Text strong>Queratometría</Text>
                <Form.Item name="odQueratometria">
                  <Input />
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
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Text strong>Cilindro</Text>
                    <Form.Item name="oiCilindro">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Text strong>Eje</Text>
                    <Form.Item name="oiEje">
                      <Input suffix="º" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Text strong>Add</Text>
                    <Form.Item name="oiADD">
                      <Input />
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
                <Text strong>Queratometría</Text>
                <Form.Item name="oiQueratometria">
                  <Input />
                </Form.Item>
              </Space>
            </Col>
          </Row>
          <Divider />
          <Row justify="center">
            <Col span={8} style={{ textAlign: 'center' }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                DIP Lejos
              </Text>
              <Form.Item name="dipLejos">
                <InputNumber suffix="mm" style={{ width: '120px' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="center">
            <Col span={8} style={{ textAlign: 'center' }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                DIP Cerca
              </Text>
              <Form.Item name="dipCerca">
                <InputNumber suffix="mm" style={{ width: '120px' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="center">
            <Col span={14} style={{ textAlign: 'center' }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Observaciones
              </Text>
              <Form.Item name="observaciones">
                <Input.TextArea rows={8} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="center">
            <Space size="large">
              <Button
                htmlType="submit"
                type="primary"
                icon={<SaveOutlined />}
                style={{
                  backgroundColor: cardColor,
                  borderColor: cardColor,
                  marginTop: 20,
                }}
              >
                {isNewExamination
                  ? 'Guardar Nueva Graduación'
                  : 'Actualizar Graduación'}
              </Button>
              {isNewExamination ? (
                <Popconfirm
                  title="¿Quieres cancelar esta nueva graduación?"
                  okButtonProps={{ danger: true }}
                  okText="Sí, cancelar"
                  cancelText="No"
                  onConfirm={() => onDeleteExamination(examination.id)}
                >
                  <Button
                    type="default"
                    color="danger"
                    icon={<StopOutlined />}
                    style={{
                      marginTop: 20,
                    }}
                  >
                    Cancelar nueva Graduación
                  </Button>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title="¿Estás seguro de que quieres eliminar esta graduación?"
                  okText="Sí, eliminar"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => onDeleteExamination(examination.id)}
                >
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    style={{
                      marginTop: 20,
                    }}
                  >
                    Eliminar Graduación
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

export default ExaminationFormPage;
