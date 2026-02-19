/* eslint-disable react/jsx-props-no-spreading */
import {
  DeleteOutlined,
  FilePdfOutlined,
  PlusOutlined
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  notification,
  Popconfirm,
  Row,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useRef } from 'react';
import AdminLayout from '../layouts/AdminLayout';

const { Text, Title } = Typography;

const PresupuestoGeneratorPage: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const componentRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = async () => {
    const divPrintElement = componentRef.current;
    if (!divPrintElement) {
      return;
    }
    const container = divPrintElement.parentElement!;

    try {
      await form.validateFields();

      container.style.visibility = 'visible';
      container.style.height = 'auto';

      const canvas = await html2canvas(divPrintElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `Presupuesto_${form.getFieldValue('cliente')}_${dayjs().format('YYYY_MM_DD')}.pdf`,
      );
    } catch (error) {
      if (error && error.errorFields) {
        api.warning({
          placement: 'top',
          message: '¡Revisa los campos obligatorios!',
        });
        return;
      }
      api.error({
        placement: 'top',
        type: 'error',
        message: '¡Error generando el PDF!',
      });
    } finally {
      container.style.visibility = 'hidden';
      container.style.height = '0';
    }
  };

  return (
    <AdminLayout>
      {contextHolder}
      <div style={{ margin: '0 auto', padding: '30px' }}>
        <Card
          variant="borderless"
          className="shadow-sm"
          title={
            <Space direction="vertical" size={0}>
              <Title level={4} style={{ margin: 0 }}>
                Generador de Presupuestos
              </Title>
            </Space>
          }
          extra={
            <Button
              type="primary"
              size="large"
              icon={<FilePdfOutlined />}
              onClick={handleGeneratePDF}
              style={{ borderRadius: '6px', fontWeight: 500 }}
            >
              Exportar PDF
            </Button>
          }
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ items: [{}], fecha: dayjs().format('DD/MM/YYYY') }}
          >
            {/* SECCIÓN CLIENTE */}
            <Row gutter={24}>
              <Col xs={24} sm={16}>
                <Form.Item
                  name="cliente"
                  label={<Text strong>Información del Cliente</Text>}
                  rules={[
                    { required: true, message: 'El nombre es obligatorio' },
                  ]}
                >
                  <Input
                    placeholder="Nombre completo o Razón Social"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="fecha"
                  label={<Text strong>Fecha de Emisión</Text>}
                >
                  <Input
                    disabled
                    size="large"
                    style={{ textAlign: 'center' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">
              <Text type="secondary">CONCEPTOS</Text>
            </Divider>

            {/* LIST OF ITEMS */}
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {/* Cabecera de la "tabla" para escritorio */}
                  <Row
                    gutter={16}
                    style={{ marginBottom: 8, padding: '0 8px' }}
                    className="hidden-xs"
                  >
                    <Col span={10}>
                      <Text type="secondary" strong>
                        Descripción del Servicio o Producto
                      </Text>
                    </Col>
                    <Col span={4}>
                      <Text type="secondary" strong>
                        Cant.
                      </Text>
                    </Col>
                    <Col span={5}>
                      <Text type="secondary" strong>
                        Precio Unit.
                      </Text>
                    </Col>
                    <Col span={3}>
                      <Text type="secondary" strong>
                        Subtotal
                      </Text>
                    </Col>
                    <Col span={2} />
                  </Row>

                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        background: '#f8f9fa',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: 12,
                        border: '1px solid #f0f0f0',
                      }}
                    >
                      <Row gutter={16} align="middle">
                        <Col xs={24} sm={10}>
                          <Form.Item
                            {...restField}
                            name={[name, 'descripcion']}
                            rules={[
                              {
                                required: true,
                                message: '¡Este campo es obligatorio!',
                              },
                            ]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="Ej. Lente Progresiva Alta Gama"
                              variant="borderless"
                              style={{ background: '#fff' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={12} sm={4}>
                          <Form.Item
                            {...restField}
                            name={[name, 'cantidad']}
                            rules={[
                              {
                                required: true,
                                message: '¡Este campo es obligatorio!',
                              },
                            ]}
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber
                              min={1}
                              style={{ background: '#fff', width: '100%' }}
                              placeholder="1"
                              variant="borderless"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={12} sm={5}>
                          <Form.Item
                            {...restField}
                            name={[name, 'precio']}
                            rules={[
                              {
                                required: true,
                                message: '¡Este campo es obligatorio!',
                              },
                            ]}
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber
                              min={0}
                              step={0.01}
                              addonAfter="€"
                              style={{ background: '#fff', width: '100%' }}
                              variant="borderless"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={20} sm={3} style={{ textAlign: 'right' }}>
                          <Form.Item shouldUpdate noStyle>
                            {() => {
                              const item = form.getFieldValue(['items', name]);
                              const subtotal =
                                (item?.precio || 0) * (item?.cantidad || 0);
                              return (
                                <Text strong style={{ fontSize: '15px' }}>
                                  {subtotal.toFixed(2)}€
                                </Text>
                              );
                            }}
                          </Form.Item>
                        </Col>
                        <Col xs={4} sm={2} style={{ textAlign: 'center' }}>
                          <Popconfirm
                            title="¿Desea eliminar esta fila?"
                            onConfirm={() => remove(name)}
                          >
                            <Tooltip title="Eliminar fila">
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                              />
                            </Tooltip>
                          </Popconfirm>
                        </Col>
                      </Row>
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{
                      height: '45px',
                      marginTop: '8px',
                      color: '#1890ff',
                      borderColor: '#1890ff',
                    }}
                  >
                    Añadir concepto nuevo
                  </Button>
                </>
              )}
            </Form.List>

            <Row justify="end" style={{ marginTop: 40 }}>
              <Col xs={24} sm={10}>
                <div
                  style={{
                    background: '#1d3557',
                    color: '#fff',
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <Form.Item
                    shouldUpdate={(prev, curr) => prev.items !== curr.items}
                    noStyle
                  >
                    {() => {
                      const items = form.getFieldValue('items') || [];
                      const base = items.reduce(
                        (acc: number, cur: any) =>
                          acc + (cur?.precio || 0) * (cur?.cantidad || 0),
                        0,
                      );
                      const iva = base * 0.21;
                      const total = base + iva;

                      return (
                        <Space
                          direction="vertical"
                          style={{ width: '100%' }}
                          size="middle"
                        >
                          <Row justify="space-between">
                            <Text style={{ color: '#fff' }}>
                              Base Imponible:
                            </Text>
                            <Text style={{ color: '#fff' }}>
                              {base.toFixed(2)} €
                            </Text>
                          </Row>
                          <Row justify="space-between">
                            <Text style={{ color: '#fff' }}>IVA (21%):</Text>
                            <Text style={{ color: '#fff' }}>
                              {iva.toFixed(2)} €
                            </Text>
                          </Row>
                          <Divider
                            style={{
                              margin: '8px 0',
                              borderColor: 'rgba(255,255,255,0.1)',
                            }}
                          />
                          <Row justify="space-between" align="middle">
                            <Text
                              strong
                              style={{ color: '#fff', fontSize: '18px' }}
                            >
                              TOTAL:
                            </Text>
                            <Title
                              level={2}
                              style={{ margin: 0, color: '#a8dadc' }}
                            >
                              {total.toFixed(2)} €
                            </Title>
                          </Row>
                        </Space>
                      );
                    }}
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>

      {/* --- EL PDF (FUERA DEL FORMULARIO PARA EVITAR BUCLES) --- */}
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          visibility: 'hidden',
          height: 0,
          overflow: 'hidden',
        }}
      >
        <div
          ref={componentRef}
          style={{ padding: '40px', background: '#fff', width: '210mm' }}
        >
          <Title level={2}>PRESUPUESTO</Title>
          <Text strong>Óptica Josu</Text>
          <Divider />

          <Form.Item shouldUpdate noStyle>
            {() => {
              const data = form.getFieldsValue();
              const items = data.items || [];
              const base = items.reduce(
                (acc: number, cur: any) =>
                  acc + (cur?.precio || 0) * (cur?.cantidad || 0),
                0,
              );
              return (
                <>
                  <p>Cliente: {data.cliente}</p>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      marginTop: 20,
                    }}
                  >
                    <thead>
                      <tr style={{ borderBottom: '2px solid #000' }}>
                        <th style={{ textAlign: 'left' }}>Descripción</th>
                        <th>Cant.</th>
                        <th style={{ textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it: any, i: number) => (
                        <tr key={i}>
                          <td>{it.descripcion}</td>
                          <td style={{ textAlign: 'center' }}>{it.cantidad}</td>
                          <td style={{ textAlign: 'right' }}>
                            {((it.precio || 0) * (it.cantidad || 0)).toFixed(2)}
                            €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ textAlign: 'right', marginTop: 30 }}>
                    <Text strong style={{ fontSize: 20 }}>
                      TOTAL: {(base * 1.21).toFixed(2)} €
                    </Text>
                  </div>
                </>
              );
            }}
          </Form.Item>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PresupuestoGeneratorPage;
