import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Divider, Form, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerModel from '../../../main/models/customer.model';
import { ROUTES } from '../../app/constants';
import AdminLayout from '../../layouts/AdminLayout';
import CustomerManagerTable from './CustomerManagerTable';

const { Text } = Typography;

dayjs.extend(isBetween);

const CustomerManagerPage: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customers, setCustomers] = useState<CustomerModel[]>([]);

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleNewCustomer = () => {
    navigate(ROUTES.CUSTOMERS_MANAGER_FORM);
  };

  const handleEdit = (record: CustomerModel) => {
    navigate(ROUTES.CUSTOMERS_MANAGER_FORM.replace(':customer_id', record.id));
  };

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const customersFetched = await window.electron.ipcMysql.getCustomers();
        setCustomers(customersFetched);
      } catch {
        setErrorMessage('¡Error al obtener los clientes de la Base de Datos!');
      } finally {
        setLoading(false);
      }
    };

    getCustomers();
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
          onClick={handleNewCustomer}
        >
          Crear Nuevo Cliente
        </Button>
      </Space>

      <Form form={form} component={false}>
        <CustomerManagerTable
          loading={isLoading}
          dataSource={customers}
          onEdit={handleEdit}
        />
      </Form>
    </AdminLayout>
  );
};

export default CustomerManagerPage;
