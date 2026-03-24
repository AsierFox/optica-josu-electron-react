/* eslint-disable react/jsx-props-no-spreading */
import {
  DeleteOutlined,
  FilePdfOutlined,
  PlusOutlined,
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
  Select,
  Space,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useRef } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const { Text, Title } = Typography;
const { Option } = Select;

const PresupuestoGeneratorPage: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const componentRef = useRef<HTMLDivElement>(null);

  const defaultConceptFormValues = { cantidad: 1, precio: 0, iva: 0.21 };
  const defaultFormValues = {
    items: [defaultConceptFormValues],
    fecha: dayjs().format('DD/MM/YYYY'),
  };

  const ivaOptions = [
    { label: '21%', value: 0.21 },
    { label: '10%', value: 0.1 },
    { label: '4%', value: 0.04 },
    { label: '0%', value: 0 },
  ];

  const handleGeneratePDF = async () => {
    const divPrintElement = componentRef.current;
    if (!divPrintElement) return;

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
      api.error({ message: '¡Error generando el PDF!' });
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
            <Title level={4} style={{ margin: 0 }}>
              Generador (IVA Incluido en Precio)
            </Title>
          }
          extra={
            <Button
              type="primary"
              size="large"
              icon={<FilePdfOutlined />}
              onClick={handleGeneratePDF}
            >
              Exportar PDF
            </Button>
          }
        >
          <Form form={form} layout="vertical" initialValues={defaultFormValues}>
            <Row gutter={24}>
              <Col xs={24} sm={16}>
                <Form.Item
                  name="cliente"
                  label={<Text strong>Cliente</Text>}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Nombre o Razón Social" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="fecha" label={<Text strong>Fecha</Text>}>
                  <Input
                    disabled
                    size="large"
                    style={{ textAlign: 'center' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
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
                        <Col xs={24} sm={7}>
                          <Form.Item
                            {...restField}
                            name={[name, 'descripcion']}
                            rules={[{ required: true, message: 'Obligatorio' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="Concepto..."
                              style={{ background: '#fff' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={6} sm={2}>
                          <Form.Item
                            {...restField}
                            name={[name, 'cantidad']}
                            rules={[{ required: true }]}
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber min={1} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                        <Col xs={10} sm={4}>
                          <Form.Item
                            {...restField}
                            name={[name, 'precio']}
                            rules={[{ required: true }]}
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber
                              min={0}
                              step={0.01}
                              addonAfter="€"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={8} sm={3}>
                          <Form.Item
                            {...restField}
                            name={[name, 'iva']}
                            rules={[{ required: true }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select style={{ width: '100%' }}>
                              {ivaOptions.map((opt) => (
                                <Option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                        {/* NUEVA COLUMNA: INFO DE BASE UNITARIA Y TOTAL LÍNEA */}
                        <Col xs={24} sm={6}>
                          <Form.Item shouldUpdate noStyle>
                            {() => {
                              const item = form.getFieldValue(['items', name]);
                              const precioConIva = item?.precio || 0;
                              const tasaIva = item?.iva || 0;
                              const cantidad = item?.cantidad || 0;

                              // Cálculos
                              const baseUnitario = precioConIva / (1 + tasaIva);
                              const totalLinea = precioConIva * cantidad;

                              return (
                                <Row gutter={8} style={{ textAlign: 'right' }}>
                                  <Col span={12}>
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: '11px' }}
                                    >
                                      Base Unit:
                                    </Text>
                                    <br />
                                    <Text style={{ fontSize: '13px' }}>
                                      {baseUnitario.toFixed(2)}€
                                    </Text>
                                  </Col>
                                  <Col span={12}>
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: '11px' }}
                                    >
                                      Subtotal:
                                    </Text>
                                    <br />
                                    <Text
                                      strong
                                      style={{
                                        fontSize: '15px',
                                        color: '#1890ff',
                                      }}
                                    >
                                      {totalLinea.toFixed(2)}€
                                    </Text>
                                  </Col>
                                </Row>
                              );
                            }}
                          </Form.Item>
                        </Col>

                        <Col xs={4} sm={2} style={{ textAlign: 'right' }}>
                          <Popconfirm
                            title="¿Eliminar?"
                            onConfirm={() => remove(name)}
                          >
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                            />
                          </Popconfirm>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add(defaultConceptFormValues)}
                    block
                    icon={<PlusOutlined />}
                  >
                    Añadir concepto
                  </Button>
                </>
              )}
            </Form.List>

            <Row justify="end" style={{ marginTop: 40 }}>
              <Col xs={24} sm={10}>
                <div
                  style={{
                    background: '#2877e6',
                    color: '#fff',
                    padding: '24px',
                    borderRadius: '12px',
                  }}
                >
                  <Form.Item shouldUpdate noStyle>
                    {() => {
                      const items = form.getFieldValue('items') || [];

                      // CÁLCULOS INVERSOS
                      const totales = items.reduce(
                        (acc: any, cur: any) => {
                          const totalLinea =
                            (cur?.precio || 0) * (cur?.cantidad || 0);
                          const tasaIva = cur?.iva || 0;

                          // Fórmula: Base = Total / (1 + IVA)
                          const baseLinea = totalLinea / (1 + tasaIva);
                          const ivaLinea = totalLinea - baseLinea;

                          acc.base += baseLinea;
                          acc.iva += ivaLinea;
                          acc.total += totalLinea;
                          return acc;
                        },
                        { base: 0, iva: 0, total: 0 },
                      );

                      return (
                        <Space
                          direction="vertical"
                          style={{ width: '100%' }}
                          size="middle"
                        >
                          <Row justify="space-between">
                            <Text style={{ color: '#fff' }}>
                              Base Imponible (Deducida):
                            </Text>
                            <Text style={{ color: '#fff' }}>
                              {totales.base.toFixed(2)} €
                            </Text>
                          </Row>
                          <Row justify="space-between">
                            <Text style={{ color: '#fff' }}>Cuota IVA:</Text>
                            <Text style={{ color: '#fff' }}>
                              {totales.iva.toFixed(2)} €
                            </Text>
                          </Row>
                          <Divider
                            style={{
                              margin: '8px 0',
                              borderColor: 'rgba(255,255,255,0.2)',
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
                              style={{ margin: 0, color: '#ffffff' }}
                            >
                              {totales.total.toFixed(2)} €
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

      {/* --- ESTRUCTURA PDF (Reflejando deducción) --- */}
      <div
        style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }}
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
              let sumBase = 0;
              let sumIva = 0;

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
                        <th>Base Unit. (Ded.)</th>
                        <th>IVA</th>
                        <th style={{ textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it: any, i: number) => {
                        const totalLinea =
                          (it.precio || 0) * (it.cantidad || 0);
                        const tasaIva = it.iva || 0;
                        const baseLinea = totalLinea / (1 + tasaIva);
                        const ivaLinea = totalLinea - baseLinea;
                        const baseUnitarioDeducido = it.precio / (1 + tasaIva);

                        sumBase += baseLinea;
                        sumIva += ivaLinea;

                        return (
                          <tr
                            key={i}
                            style={{ borderBottom: '1px solid #eee' }}
                          >
                            <td>{it.descripcion}</td>
                            <td style={{ textAlign: 'center' }}>
                              {it.cantidad}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {baseUnitarioDeducido.toFixed(2)}€
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {tasaIva * 100}%
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {totalLinea.toFixed(2)}€
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div style={{ textAlign: 'right', marginTop: 30 }}>
                    <p>Base Imponible: {sumBase.toFixed(2)} €</p>
                    <p>IVA: {sumIva.toFixed(2)} €</p>
                    <Text strong style={{ fontSize: 22 }}>
                      TOTAL: {(sumBase + sumIva).toFixed(2)} €
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
