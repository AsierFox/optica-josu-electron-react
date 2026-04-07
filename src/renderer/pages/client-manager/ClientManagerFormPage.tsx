import {
  ArrowLeftOutlined,
  HomeOutlined,
  IdcardOutlined,
  PhoneOutlined,
  SaveOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClientModel from '../../../main/models/client.model';
import { ROUTES } from '../../app/constants';
import AdminLayout from '../../layouts/AdminLayout';
import ExaminationsForm from './ExaminationsForm';

const ClientManagerFormPage: React.FC = () => {
  const [client, setClient] = useState<ClientModel | null>(null);

  // eslint-disable-next-line camelcase
  const { client_id } = useParams<{ client_id: string }>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    // form.setFieldsValue({
    //   ...initialData,
    //   // Convertimos el timestamp/number a objeto dayjs para el DatePicker
    //   fechaNacimiento: initialData.fechaNacimiento ? dayjs(initialData.fechaNacimiento) : null,
    // });
  }, [form]);

  const handleSubmit = (values: any) => {
    // const formattedValues = {
    //   ...values,
    //   fechaNacimiento: values.fechaNacimiento ? values.fechaNacimiento.valueOf() : null,
    // };
    // onSave(formattedValues);
  };

  useEffect(() => {
    const getClientById = async (clientId: number) => {
      try {
        const clientDDBB =
          await window.electron.ipcMysql.getClientById(clientId);

        if (!clientDDBB) {
          setErrorMessage(
            '¡Ha habido un error buscando el cliente seleccionado!',
          );
        }

        setClient(clientDDBB);

        form.setFieldsValue({
          ...clientDDBB,
          // Convertimos la fecha al formato que entiende el DatePicker (dayjs),
          // porque si no le pasamos un timestamp/number, el DatePicker no lo muestra.
          fechaNacimiento: clientDDBB.fechaNacimiento
            ? dayjs(clientDDBB.fechaNacimiento)
            : null,
        });
      } catch {
        setErrorMessage('¡No se pudo cargar el cliente!');
      }
    };
    form.resetFields();
    // @ts-ignore
    // eslint-disable-next-line no-restricted-globals, camelcase
    if (!isNaN(client_id) && client_id) {
      const clientId = parseInt(client_id, 10);
      getClientById(clientId);
    }
    // eslint-disable-next-line camelcase, react-hooks/exhaustive-deps
  }, [client_id, form]);

  return (
    <AdminLayout>
      {contextHolder}
      {errorMessage ? (
        <Alert
          message="Error"
          showIcon
          type="error"
          style={{ marginBottom: 16 }}
          description={errorMessage}
        />
      ) : null}

      <Card>
        <Button
          icon={<ArrowLeftOutlined />}
          style={{ marginBottom: '20px' }}
          onClick={() => navigate(ROUTES.CLIENT_MANAGER)}
        >
          Volver al listado de clientes
        </Button>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* SECCIÓN 1: DATOS PERSONALES */}
          <Divider orientation="left">
            <UserOutlined /> Datos Personales
          </Divider>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="nombre" label="Nombre">
                <Input placeholder="Nombre del cliente" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="apellidos" label="Apellidos">
                <Input placeholder="Apellidos del cliente" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="DNI" label="DNI / NIE / Pasaporte">
                <Input prefix={<IdcardOutlined />} placeholder="12345678Z" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="fechaNacimiento" label="Fecha de Nacimiento">
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  placeholder="Seleccionar fecha"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* SECCIÓN 2: CONTACTO Y DIRECCIÓN */}
          <Divider orientation="left">
            <HomeOutlined /> Contacto y Ubicación
          </Divider>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item name="telefono" label="Teléfono">
                <Input prefix={<PhoneOutlined />} placeholder="600 000 000" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={16}>
              <Form.Item name="direccion" label="Dirección">
                <Input placeholder="Calle, número, piso..." />
              </Form.Item>
            </Col>
            <Col xs={24} sm={16}>
              <Form.Item name="ciudad" label="Ciudad">
                <Input placeholder="Vitoria-Gasteiz" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="codigoPostal" label="Código Postal">
                <InputNumber style={{ width: '100%' }} placeholder="01001" />
              </Form.Item>
            </Col>
          </Row>

          {/* SECCIÓN 3: OBSERVACIONES */}
          <Divider orientation="left">Notas Adicionales</Divider>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="notes" label="Notas internas">
                <Input.TextArea
                  rows={4}
                  placeholder="Alergias, preferencias de montura, etc."
                />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              style={{ backgroundColor: '#13c2c2', borderColor: '#13c2c2' }}
            >
              Guardar Cliente
            </Button>
          </Row>

          <ExaminationsForm />
        </Form>
      </Card>
    </AdminLayout>
  );
};

export default ClientManagerFormPage;
