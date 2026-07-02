import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Divider, Form, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientModel from '../../../main/models/client.model';
import { ROUTES } from '../../app/constants';
import AdminLayout from '../../layouts/AdminLayout';
import ClientManagerTable from './ClientManagerTable';

const { Text } = Typography;

dayjs.extend(isBetween);

const ClientManagerPage: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clients, setClients] = useState<ClientModel[]>([]);

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleNewClient = () => {
    navigate(ROUTES.CLIENT_MANAGER_FORM);
  };

  const handleEdit = (record: ClientModel) => {
    navigate(ROUTES.CLIENT_MANAGER_FORM.replace(':client_id', record.id));
  };

  useEffect(() => {
    const getClients = async () => {
      try {
        const clientsFetched = await window.electron.ipcMysql.getClients();
        setClients(clientsFetched);
      } catch {
        setErrorMessage('¡Error al obtener los clientes de la Base de Datos!');
      } finally {
        setLoading(false);
      }
    };

    getClients();
  }, []);

  return (
    <AdminLayout>
      {errorMessage ? (
        <Alert
          message="Error"
          showIcon
          type="error"
          style={{ marginBottom: 16 }}
          description={errorMessage}
        />
      ) : null}

      <Text strong style={{ fontSize: '15px', color: '#141414' }}>
        Gestión de Clientes
      </Text>

      <Divider />

      <Space size="middle" style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleNewClient}
        >
          Crear Nuevo Cliente
        </Button>
      </Space>

      <Form form={form} component={false}>
        <ClientManagerTable
          loading={isLoading}
          dataSource={clients}
          onEdit={handleEdit}
        />
      </Form>
    </AdminLayout>
  );
};

export default ClientManagerPage;
