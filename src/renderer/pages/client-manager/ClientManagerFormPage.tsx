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
  Spin,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClientModel from '../../../main/models/client.model';
import ExaminationModel from '../../../main/models/examination.model';
import ExaminationTypeModel from '../../../main/models/examinationType.model';
import { NEW_ROW_ID_PREFIX, ROUTES } from '../../app/constants';
import AdminLayout from '../../layouts/AdminLayout';
import ExaminationForm from './ExaminationForm';

const { Title } = Typography;

const ClientManagerFormPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isNewClient, setIsNewClient] = useState<boolean>(false);
  const [client, setClient] = useState<ClientModel | null>(null);
  const [examinationTypes, setExaminationTypes] = useState<
    ExaminationTypeModel[]
  >([]);
  const [examinations, setExaminations] = useState<ExaminationModel[]>([]);

  // eslint-disable-next-line camelcase
  const { client_id } = useParams<{ client_id: string }>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const handleClientSubmit = async (values: any) => {
    setLoading(true);

    try {
      const updatedClient: ClientModel = {
        ...client,
        ...values,
        fechaNacimiento: values.fechaNacimiento?.format('YYYY-MM-DD'),
      } as ClientModel;

      if (isNewClient) {
        const newClientId =
          await window.electron.ipcMysql.createClient(updatedClient);

        updatedClient.id = newClientId;
        // Ahora que el cliente tiene un ID, dejamos de considerarlo "nuevo".
        setIsNewClient(false);
      } else {
        await window.electron.ipcMysql.updateClient(updatedClient);
      }

      setClient(updatedClient);

      api.success({
        message: 'Éxito',
        description: `¡Cliente ${isNewClient ? 'creado' : 'actualizado'} correctamente!`,
      });
    } catch (error) {
      api.error({
        message: 'Error',
        description: '¡No se pudo guardar el cliente!',
      });
      setErrorMessage(
        `¡No se pudo guardar el cliente! ${error?.message || error}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExamination = (examinationId: string) => {
    setLoading(true);
    setExaminations((prevExaminations) =>
      prevExaminations.filter(
        (examination) => examination.id !== examinationId,
      ),
    );
    setLoading(false);
    api.success({
      message: '¡Graduación Eliminada!',
    });
  };

  const createNewExamination = () => {
    if (!client) {
      api.error({
        message: 'Error',
        description: '¡No se pudo cargar el cliente!',
      });
      return;
    }

    setLoading(true);

    const isNewExaminationAlreadyAdded = examinations.some((examination) =>
      examination.id.toString().startsWith(NEW_ROW_ID_PREFIX),
    );

    if (isNewExaminationAlreadyAdded) {
      api.warning({
        message: 'Atención',
        description:
          'Ya estás añadiendo una nueva graduación. Por favor, guarda o cancela la nueva graduación antes de añadir otra.',
      });
      setLoading(false);
      return;
    }

    const newExaminationRecordDate = dayjs(new Date()).toISOString();

    setExaminations([
      {
        id: NEW_ROW_ID_PREFIX + Date.now(),
        idClient: parseInt(client.id, 10),
        idExaminationType: 1,
        createdAt: newExaminationRecordDate,
        updatedAt: newExaminationRecordDate,
      } as ExaminationModel,
      ...examinations,
    ]);

    setLoading(false);
  };

  useEffect(() => {
    const getClientAndExaminationsById = async (clientId: number) => {
      try {
        const examinationTypesDDBB =
          await window.electron.ipcMysql.getExaminationTypes();

        setExaminationTypes(examinationTypesDDBB);

        const clientDDBB =
          await window.electron.ipcMysql.getClientById(clientId);

        if (!clientDDBB) {
          setErrorMessage(
            '¡Ha habido un error buscando el cliente seleccionado!',
          );
        }

        const clientExaminatiosDDBB =
          await window.electron.ipcMysql.getExaminationsClientById(clientId);

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
      } catch (error) {
        api.error({
          message: 'Error',
          description: '¡No se pudo guardar el cliente!',
        });
        setErrorMessage(
          `¡No se pudo guardar el cliente! ${error?.message || error}`,
        );
      } finally {
        setLoading(false);
      }
    };

    form.resetFields();
    // @ts-ignore
    // eslint-disable-next-line no-restricted-globals, camelcase
    if (!isNaN(client_id) && client_id) {
      // Cliente existente, cargamos sus datos y sus graduaciones
      const clientId = parseInt(client_id, 10);
      getClientAndExaminationsById(clientId);
    } else {
      // Nuevo cliente, inicializamos el formulario vacío
      setIsNewClient(true);
      setClient({ id: NEW_ROW_ID_PREFIX + Date.now() } as ClientModel);
      setLoading(false);
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

      <Spin spinning={loading} size="large">
        <Card>
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 20 }}
          >
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(ROUTES.CLIENT_MANAGER)}
            >
              Volver al listado de clientes
            </Button>

            <h2 style={{ color: '#5e7b8a' }}>
              {isNewClient ? 'Creando Nuevo Cliente' : 'Editando Cliente'}
            </h2>
          </Row>

          <Form form={form} onFinish={handleClientSubmit} layout="vertical">
            {/* DATOS PERSONALES */}
            <Divider orientation="left">
              <UserOutlined /> Datos Personales
            </Divider>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item required name="nombre" label="Nombre">
                  <Input required placeholder="Nombre del cliente" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item required name="apellidos" label="Apellidos">
                  <Input required placeholder="Apellidos del cliente" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="DNI" label="DNI / NIE / Pasaporte">
                  <Input prefix={<IdcardOutlined />} placeholder="12345678Z" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  required
                  name="fechaNacimiento"
                  label="Fecha de Nacimiento"
                >
                  <DatePicker
                    required
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
                <Form.Item required name="telefono" label="Teléfono">
                  <Input
                    required
                    prefix={<PhoneOutlined />}
                    placeholder="600 000 000"
                  />
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
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="end">
              <Button
                htmlType="submit"
                type="primary"
                icon={<SaveOutlined />}
                style={{ backgroundColor: '#13c2c2', borderColor: '#13c2c2' }}
              >
                Guardar Cliente
              </Button>
            </Row>
          </Form>

          {/* EXAMINATIOS */}
          <Card style={{ marginTop: 30 }} hidden={isNewClient}>
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
              <ExaminationForm
                key={`examination-form-${examination.id}`}
                examination={examination}
                examinationTypes={examinationTypes}
                isLastExamination={i === 0}
                handleDeleteExamination={handleDeleteExamination}
              />
            ))}
          </Card>
        </Card>
      </Spin>
    </AdminLayout>
  );
};

export default ClientManagerFormPage;
