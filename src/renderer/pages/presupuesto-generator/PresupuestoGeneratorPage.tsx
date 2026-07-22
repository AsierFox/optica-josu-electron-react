/* eslint-disable react/jsx-props-no-spreading */
import {
  DeleteOutlined,
  FilePdfOutlined,
  LoadingOutlined,
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
  Spin,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useRef } from 'react';
import logoPresupuesto from '../../../../assets/logo-presupuesto.png';
import AdminLayout from '../../layouts/AdminLayout';

const { Text, Title } = Typography;
const { Option } = Select;

const PresupuestoGeneratorPage: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const componentRef = useRef<HTMLDivElement>(null);
  const [generatingPDF, setGeneratingPDF] = React.useState(false);

  const defaultConceptFormValues = { cantidad: 1, precio: 0, iva: 0.21 };
  const defaultFormValues = {
    items: [defaultConceptFormValues],
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
      setGeneratingPDF(true);
      // 1. Validamos campos
      await form.validateFields();

      // 2. Hacemos el contenedor visible pero manteniéndolo fuera de la vista del usuario
      // Esto es vital para que html2canvas pueda medir dimensiones correctamente
      container.style.visibility = 'visible';
      container.style.height = 'auto';
      container.style.position = 'absolute';

      // 3. PEQUEÑA ESPERA (Crucial para que React renderice los múltiples conceptos)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const canvas = await html2canvas(divPrintElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: divPrintElement.scrollWidth, // Forzamos ancho
        windowHeight: divPrintElement.scrollHeight, // Forzamos alto
      });

      const imgData = canvas.toDataURL('image/png');
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `Presupuesto_${form.getFieldValue('customer') ?? 'SinNombre'}_${dayjs().format('YYYY_MM_DD')}.pdf`,
      );
    } catch (error) {
      console.error(error);
      api.error({ message: '¡Error generando el PDF!' });
    } finally {
      // 4. Volvemos a ocultar
      container.style.visibility = 'hidden';
      container.style.height = '0';
      setGeneratingPDF(false);
    }
  };

  return (
    <AdminLayout>
      {contextHolder}
      {generatingPDF ? (
        <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        />
      ) : null}
      <div style={{ margin: '0 auto', padding: '30px' }}>
        <Card
          variant="borderless"
          className="shadow-sm"
          title={
            <Title level={4} style={{ margin: 0 }}>
              Generador de Presupuesto
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
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="customer"
                  label={<Text strong>Cliente / Razón Social</Text>}
                  rules={[
                    { required: true, message: 'El nombre es obligatorio' },
                  ]}
                >
                  <Input placeholder="Nombre completo" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={4}>
                <Form.Item
                  name="dni"
                  label={<Text strong>DNI / CIF</Text>}
                  rules={[
                    { required: true, message: 'El DNI / CIF es obligatorio' },
                  ]}
                >
                  <Input placeholder="12345678X" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={4}>
                <Form.Item
                  name="telefono"
                  label={<Text strong>Teléfono</Text>}
                  rules={[
                    { required: true, message: 'El teléfono es obligatorio' },
                  ]}
                >
                  <Input placeholder="600 000 000" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={4}>
                <Form.Item
                  name="numero"
                  label={<Text strong>Nº Presupuesto</Text>}
                  rules={[
                    {
                      required: true,
                      message: 'El número de presupuesto es obligatorio',
                    },
                  ]}
                >
                  <Input size="large" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="direccion"
                  label={<Text strong>Dirección</Text>}
                  rules={[
                    { required: true, message: 'La dirección es obligatoria' },
                  ]}
                >
                  <Input placeholder="Calle, número, piso..." size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="ciudad"
                  label={<Text strong>Ciudad</Text>}
                  rules={[
                    { required: true, message: 'La ciudad es obligatoria' },
                  ]}
                >
                  <Input placeholder="Población" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={4}>
                <Form.Item
                  name="codigoPostal"
                  label={<Text strong>Código Postal</Text>}
                  rules={[
                    {
                      required: true,
                      message: 'El código postal es obligatorio',
                    },
                  ]}
                >
                  <Input placeholder="48001" size="large" />
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
                            rules={[
                              {
                                required: true,
                                message:
                                  '¡Tiene que haber al menos un concepto!',
                              },
                            ]}
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

                        <Col xs={24} sm={6}>
                          <Form.Item shouldUpdate noStyle>
                            {() => {
                              const item = form.getFieldValue(['items', name]);
                              const precioConIva = item?.precio ?? 0;
                              const tasaIva = item?.iva ?? 0;
                              const cantidad = item?.cantidad ?? 0;

                              const baseUnitario = precioConIva / (1 + tasaIva);
                              const totalLinea = precioConIva * cantidad;

                              return (
                                <Row gutter={8} style={{ textAlign: 'right' }}>
                                  <Col span={12}>
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: '11px' }}
                                    >
                                      Base Imponible (Uni.)
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
                                      Subtotal
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
                              disabled={fields.length <= 1}
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
                      const items = form.getFieldValue('items') ?? [];

                      // CÁLCULOS INVERSOS
                      const totales = items.reduce(
                        (acc: any, cur: any) => {
                          const totalLinea =
                            (cur?.precio ?? 0) * (cur?.cantidad ?? 0);
                          const tasaIva = cur?.iva ?? 0;

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
                              Base Imponible:
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

      {/* --- ESTRUCTURA PDF (Renderizado optimizado para jsPDF) --- */}
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
        <div
          ref={componentRef}
          style={{
            padding: '40px',
            background: '#fff',
            width: '210mm',
            minHeight: '297mm',
            fontFamily: 'Arial, sans-serif',
            color: '#333',
          }}
        >
          {/* Cabecera */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div>
                <div>
                  <img
                    src={logoPresupuesto}
                    alt="Logo Óptica Josu"
                    style={{
                      width: '380px',
                      height: 'auto',
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 400 }}>
                Nº Presupuesto: {form.getFieldValue('numero')}
              </div>
              <div style={{ fontSize: 15, fontWeight: 300 }}>
                Fecha: {dayjs().format('DD/MM/YYYY')}
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: '2px solid #81C784',
              marginTop: '22px',
              marginBottom: '30px',
            }}
          />
          {/* Datos del Cliente */}
          <Form.Item shouldUpdate noStyle>
            {() => {
              const values = form.getFieldsValue();

              // Estilo común para las filas de datos
              const rowStyle = { display: 'flex', marginBottom: 2 };
              const labelStyle = {
                width: '70px',
                fontWeight: '500',
                color: '#888',
              };
              const valueStyle = { flex: 1 };

              return (
                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                    fontSize: 13,
                    marginBottom: 30,
                    width: '100%',
                    alignItems: 'stretch',
                  }}
                >
                  {/* CUADRO IZQUIERDO */}
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        marginBottom: 5,
                        fontWeight: 'bold',
                      }}
                    >
                      CLIENTE
                    </div>
                    <div
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        padding: 15,
                        flex: 1,
                        backgroundColor: '#fff',
                      }}
                    >
                      <div style={{ color: '#555', lineHeight: '1.4' }}>
                        <div
                          style={{
                            ...rowStyle,
                            fontSize: 14,
                            fontWeight: 'bold',
                          }}
                        >
                          <span style={labelStyle}>Nombre:</span>
                          <span style={valueStyle}>{values.customer}</span>
                        </div>
                      </div>
                      <div style={rowStyle}>
                        <span style={labelStyle}>Dirección:</span>
                        <span style={valueStyle}>{values.direccion}</span>
                      </div>
                      <div style={rowStyle}>
                        <span style={labelStyle}>Población:</span>
                        <span style={valueStyle}>
                          {values.ciudad} {values.codigoPostal}
                        </span>
                      </div>
                      <div style={rowStyle}>
                        <span style={labelStyle}>DNI/NIF:</span>
                        <span style={valueStyle}>{values.dni}</span>
                      </div>
                      <div style={rowStyle}>
                        <span style={labelStyle}>Teléfono:</span>
                        <span style={valueStyle}>{values.telefono}</span>
                      </div>
                    </div>
                  </div>

                  {/* CUADRO DERECHO */}
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        marginBottom: 5,
                        fontWeight: 'bold',
                      }}
                    >
                      EMISOR
                    </div>
                    <div
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        padding: 15,
                        flex: 1,
                        backgroundColor: '#fff',
                      }}
                    >
                      <div style={{ marginBottom: 10, fontSize: 14 }}>
                        <b>CENTRO ÓPTICO JOSU</b>
                      </div>
                      <div style={{ color: '#555', lineHeight: '1.4' }}>
                        <div style={rowStyle}>
                          <span style={valueStyle}>ITURRALDE 3</span>
                        </div>
                        <div style={rowStyle}>
                          <span style={valueStyle}>01470 AMURRIO, ALAVA</span>
                        </div>
                        <div style={rowStyle}>
                          <span style={valueStyle}>CIF: 30598959N</span>
                        </div>
                        <div style={rowStyle}>
                          <span style={valueStyle}>Tel: 945393778</span>
                        </div>
                        <div style={rowStyle}>
                          <span style={valueStyle}>
                            Correo: jbordes@cnoo.es
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          </Form.Item>

          {/* Tabla de Conceptos */}
          <Form.Item shouldUpdate noStyle>
            {() => {
              const items = form.getFieldValue('items') ?? [];
              let subtotal = 0;
              let totalIva = 0;

              return (
                <>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #111' }}>
                        <th
                          style={{
                            padding: '10px 8px',
                            textAlign: 'left',
                            fontSize: 12,
                          }}
                        >
                          Descripción
                        </th>
                        <th
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            fontSize: 12,
                          }}
                        >
                          Cant.
                        </th>
                        <th
                          style={{
                            padding: '10px 8px',
                            textAlign: 'right',
                            fontSize: 12,
                          }}
                        >
                          P. Unit
                        </th>
                        <th
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            fontSize: 12,
                          }}
                        >
                          IVA
                        </th>
                        <th
                          style={{
                            padding: '10px 8px',
                            textAlign: 'right',
                            fontSize: 12,
                          }}
                        >
                          Importe
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it: any, i: number) => {
                        const cant = it.cantidad ?? 0;
                        const precioConIva = it.precio ?? 0;
                        const tasaIva = it.iva ?? 0;

                        const totalLinea = precioConIva * cant;
                        const baseUnit = precioConIva / (1 + tasaIva);
                        const baseTotalLinea = totalLinea / (1 + tasaIva);
                        const ivaLinea = totalLinea - baseTotalLinea;

                        subtotal += baseTotalLinea;
                        totalIva += ivaLinea;

                        return (
                          <tr
                            key={i}
                            style={{ borderBottom: '1px solid #eee' }}
                          >
                            <td style={{ padding: '12px' }}>
                              {it.descripcion}
                            </td>
                            <td
                              style={{ padding: '12px', textAlign: 'center' }}
                            >
                              {cant}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                              {baseUnit.toFixed(2)}€
                            </td>
                            <td
                              style={{ padding: '12px', textAlign: 'center' }}
                            >
                              {tasaIva * 100}%
                            </td>
                            <td
                              style={{
                                padding: '12px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                              }}
                            >
                              {totalLinea.toFixed(2)}€
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Totales */}
                  <div
                    style={{
                      width: 280,
                      marginTop: 30,
                      marginLeft: 'auto',
                      border: '1px solid #e5e7eb',
                      borderRadius: 6,
                      padding: 15,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 6,
                      }}
                    >
                      <span>Base imponible</span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                      }}
                    >
                      <span>IVA</span>
                      <span>{totalIva.toFixed(2)} €</span>
                    </div>

                    <div
                      style={{
                        borderTop: '2px solid #111',
                        paddingTop: 10,
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <strong>Total</strong>
                      <strong style={{ fontSize: 18 }}>
                        {(subtotal + totalIva).toFixed(2)} €
                      </strong>
                    </div>
                  </div>
                </>
              );
            }}
          </Form.Item>

          <div
            style={{
              marginTop: 60,
              borderTop: '1px solid #81C784',
              paddingTop: 10,
              fontSize: 10,
              color: '#777',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>Centro Óptico Josu</div>
            <div>Iturralde 3, Amurrio · 945 39 37 78</div>
            <div>jbordes@cnoo.es</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PresupuestoGeneratorPage;
