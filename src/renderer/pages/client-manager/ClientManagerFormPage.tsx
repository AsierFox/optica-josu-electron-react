import {
  ArrowLeftOutlined,
  HistoryOutlined,
  HomeOutlined,
  IdcardOutlined,
  PhoneOutlined,
  PlusOutlined,
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
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClientModel from '../../../main/models/client.model';
import ExaminationModel from '../../../main/models/examination.mode';
import { NEW_ROW_ID_PREFIX, ROUTES } from '../../app/constants';
import AdminLayout from '../../layouts/AdminLayout';
import ExaminationsForm from './ExaminationsForm';

const { Title } = Typography;

const ClientManagerFormPage: React.FC = () => {
  const [client, setClient] = useState<ClientModel | null>(null);
  const [examinations, setExaminations] = useState<ExaminationModel[]>([]);

  // eslint-disable-next-line camelcase
  const { client_id } = useParams<{ client_id: string }>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const handleClientSubmit = (values: any) => {
    // const formattedValues = {
    //   ...values,
    //   fechaNacimiento: values.fechaNacimiento ? values.fechaNacimiento.valueOf() : null,
    // };
    // onSave(formattedValues);
  };

  const handleCancelNewExamination = () => {
    setExaminations((prevExaminations) =>
      prevExaminations.filter(
        (examination) => !examination.id.toString().startsWith(NEW_ROW_ID_PREFIX),
      ),
    );
  };

  const createNewExamination = () => {
    const isNewExaminationAlreadyAdded = examinations.some((examination) =>
      examination.id.toString().startsWith(NEW_ROW_ID_PREFIX),
    );

    if (isNewExaminationAlreadyAdded) {
      api.warning({
        message: 'Atención',
        description:
          'Ya estás añadiendo una nueva graduación. Por favor, guarda o elimina esa graduación antes de añadir otra.',
      });
      return;
    }

    setExaminations([{ id: NEW_ROW_ID_PREFIX + Date.now() }, ...examinations]);
  };

  useEffect(() => {
    const getClientAndExaminationsById = async (clientId: number) => {
      try {
        const clientDDBB =
          await window.electron.ipcMysql.getClientById(clientId);

        if (!clientDDBB) {
          setErrorMessage(
            '¡Ha habido un error buscando el cliente seleccionado!',
          );
        }

        const clientExaminatiosDDBB =
          await window.electron.ipcMysql.getExaminatiosClientById(clientId);

        setClient(clientDDBB);
        setExaminations(clientExaminatiosDDBB);

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
      getClientAndExaminationsById(clientId);
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

        <Form form={form} layout="vertical" onFinish={handleClientSubmit}>
          {/* DATOS PERSONALES */}
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

          {/* CONTACTO Y DIRECCIÓN */}
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

          {/* OBSERVACIONES */}
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
        </Form>

        {/* EXAMINATIOS */}
        <div style={{ marginBottom: '20px' }}>
          <Title level={3} style={{ marginBottom: '15px' }}>
            <HistoryOutlined /> Historial de Graduaciones
          </Title>

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            style={{ borderColor: '#13c2c2', color: '#13c2c2' }}
            onClick={createNewExamination}
          >
            Nueva Graduación
          </Button>
        </div>

        {examinations.map((examination, i) => (
          <ExaminationsForm
            examination={examination}
            examinationTime={i === 0 ? 'LAST' : 'OLD'}
            handleCancelNewExamination={handleCancelNewExamination}
          />
        ))}
      </Card>
    </AdminLayout>
  );
};

export default ClientManagerFormPage;
