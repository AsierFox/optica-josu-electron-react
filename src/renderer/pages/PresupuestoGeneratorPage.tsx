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
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useRef, useState } from 'react';
import dayjs from 'dayjs';
import AdminLayout from '../layouts/AdminLayout';

const { Text, Title } = Typography;

const PresupuestoGeneratorPage: React.FC = () => {
  const [totals, setTotals] = useState({ base: 0, iva: 0, total: 0 });
  const [productsForPrint, setProductsForPrint] = useState<any[]>([]);
  const [cliente, setCliente] = useState('');

  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const componentRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = async () => {
    let divPrintElement: HTMLDivElement | null = null;
    try {
      await form.validateFields();

      divPrintElement = componentRef.current;
      if (!divPrintElement) return;

      // Temporalmente lo hacemos visible para que html2canvas pueda "verlo"
      divPrintElement.parentElement!.style.display = 'block';

      const canvas = await html2canvas(divPrintElement, {
        scale: 2, // Doble resolución para que el texto no se vea borroso
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `Presupuesto_${cliente || 'Cliente'}_${dayjs().format('YYYY_MM_DD')}.pdf`,
      );
    } catch (error) {
      if (error && error.errorFields) {
        api.error({
          placement: 'top',
          type: 'error',
          message: '¡Revisa los campos del presupuesto!',
        });
        return;
      }

      api.error({
        placement: 'top',
        type: 'error',
        message: '¡Error generando el PDF!',
      });
    } finally {
      if (divPrintElement) {
        divPrintElement.parentElement!.style.display = 'none';
      }
    }
  };

  const handleValuesChange = (_: any, allValues: any) => {
    const items = allValues.items || [];
    setCliente(allValues.cliente);
    setProductsForPrint(items);

    let base = 0;
    let totalIva = 0;
    items.forEach((item: any) => {
      if (item?.precio && item?.cantidad) {
        const lineBase = item.precio * item.cantidad;
        const ivaPercent = item.iva || 0;
        base += lineBase;
        totalIva += lineBase * (ivaPercent / 100);
      }
    });
    setTotals({ base, iva: totalIva, total: base + totalIva });
  };

  return (
    <AdminLayout>
      {contextHolder}
      <Card
        title={
          <Title level={3} style={{ marginTop: '8px' }}>
            Generar Presupuesto
          </Title>
        }
        extra={
          <Space>
            <Button
              icon={<FilePdfOutlined />}
              type="primary"
              onClick={handleGeneratePDF}
            >
              Generar PDF
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleValuesChange}
          initialValues={{
            items: [{}], // Una fila vacía al empezar
            fecha: new Date().toLocaleDateString(),
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cliente"
                label="Cliente / Paciente"
                rules={[{ required: true, message: 'Falta el nombre' }]}
              >
                <Input placeholder="Nombre del cliente" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="fecha" label="Fecha">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Conceptos</Divider>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div
                style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}
              >
                {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={16} key={key} align="bottom">
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'descripcion']}
                        label="Descripción"
                        rules={[
                          { required: true, message: 'Falta descripción' },
                        ]}
                      >
                        <Input placeholder="Ej. Lentes Progresivas" />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        name={[name, 'cantidad']}
                        label="Cant."
                        rules={[{ required: true, message: '?' }]}
                      >
                        <InputNumber min={1} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, 'precio']}
                        label="Precio Unidad"
                        rules={[{ required: true, message: '?' }]}
                      >
                        <InputNumber
                          min={0}
                          step={0.01}
                          addonAfter="€"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, 'iva']}
                        label="IVA %"
                        initialValue={21}
                      >
                        <Select
                          options={[
                            { value: 21, label: '21%' },
                            { value: 10, label: '10%' },
                            { value: 4, label: '4%' },
                            { value: 0, label: 'Exento' },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      span={3}
                      style={{
                        textAlign: 'center',
                        height: '65px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: '15px',
                      }}
                    >
                      <Text style={{ fontSize: '20px' }}>
                        {(
                          (form.getFieldValue(['items', name, 'precio']) || 0) *
                          (form.getFieldValue(['items', name, 'cantidad']) || 0)
                        ).toFixed(2)}{' '}
                        €
                      </Text>
                    </Col>
                    <Col
                      span={2}
                      style={{
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: '10px',
                      }}
                    >
                      <Button
                        type="text"
                        danger
                        onClick={() => remove(name)}
                        icon={<DeleteOutlined />}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '60px',
                          height: '60px',
                        }}
                      />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Añadir concepto
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>

          <Divider />

          <Row justify="end">
            <Col span={8}>
              <div
                style={{
                  background: '#fafafa',
                  padding: '16px',
                  borderRadius: '8px',
                }}
              >
                <Row justify="space-between">
                  <Text>Base Imponible:</Text>
                  <Text strong>{totals.base.toFixed(2)} €</Text>
                </Row>
                <Row justify="space-between">
                  <Text>IVA:</Text>
                  <Text strong>{totals.iva.toFixed(2)} €</Text>
                </Row>
                <Divider style={{ margin: '12px 0' }} />
                <Row justify="space-between">
                  <Text strong>TOTAL:</Text>
                  <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                    {totals.total.toFixed(2)} €
                  </Title>
                </Row>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* --- PDF Oculto para Imprimir --- */}
      <div style={{ display: 'none' }}>
        <div
          ref={componentRef}
          style={{ padding: '40px', color: '#000', background: '#fff' }}
        >
          <Row justify="space-between">
            <Col>
              <Title level={2}>PRESUPUESTO</Title>
              <Text strong>Centro Óptico Josu</Text>
            </Col>
            <Col style={{ textAlign: 'right' }}>
              <Text>Fecha: {new Date().toLocaleDateString()}</Text>
            </Col>
          </Row>
          <Divider style={{ borderTop: '2px solid #000' }} />
          <div style={{ marginBottom: 20 }}>
            <Text type="secondary">CLIENTE:</Text>
            <br />
            <Text strong>{cliente || '________________'}</Text>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{
                  background: '#f5f5f5',
                  borderBottom: '1px solid #000',
                }}
              >
                <th style={{ padding: 10, textAlign: 'left' }}>Descripción</th>
                <th style={{ padding: 10 }}>Cant.</th>
                <th style={{ padding: 10, textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {productsForPrint.map((item, i) => (
                <tr
                  key={`print_item_${i}`}
                  style={{ borderBottom: '1px solid #eee' }}
                >
                  <td style={{ padding: 10 }}>{item?.descripcion}</td>
                  <td style={{ padding: 10, textAlign: 'center' }}>
                    {item?.cantidad}
                  </td>
                  <td style={{ padding: 10, textAlign: 'right' }}>
                    {((item?.precio || 0) * (item?.cantidad || 0)).toFixed(2)}€
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Row justify="end" style={{ marginTop: 20 }}>
            <Col span={8}>
              <Row justify="space-between">
                <Text>Base:</Text>
                <Text>{totals.base.toFixed(2)} €</Text>
              </Row>
              <Row justify="space-between">
                <Text>IVA:</Text>
                <Text>{totals.iva.toFixed(2)} €</Text>
              </Row>
              <Divider style={{ margin: '5px 0' }} />
              <Row justify="space-between">
                <Text strong>TOTAL:</Text>
                <Text strong>{totals.total.toFixed(2)} €</Text>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PresupuestoGeneratorPage;
