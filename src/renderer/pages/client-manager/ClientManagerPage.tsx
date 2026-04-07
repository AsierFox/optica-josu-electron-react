import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Form, notification, Space } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientModel from '../../../main/models/client.model';
import ProductTypeModel from '../../../main/models/productType.model';
import { ROUTES } from '../../app/constants';
import AdminLayout from '../../layouts/AdminLayout';
import ClientManagerTable from './ClientManagerTable';

dayjs.extend(isBetween);

const ClientManagerPage: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tableDataSource, setTableDataSource] = useState<ClientModel[]>([]);
  const [clients, setClients] = useState<ClientModel[]>([]);
  const [productTypes, setProductTypes] = useState<ProductTypeModel[]>([]);

  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // const handleFilter = useCallback(
  //   (filters: Readonly<Record<string, ProductStockFilterValue>>) => {
  //     const filteredData = products.filter((item) => {
  //       return Object.values(filters).every(
  //         (filter: ProductStockFilterValue) => {
  //           const itemValue = item[filter.targetKey];

  //           switch (filter.type) {
  //             case 'SINGLE':
  //               if (!filter.value) {
  //                 return true;
  //               }
  //               return util.includesStrings(itemValue, filter.value);

  //             case 'MULTIPLE':
  //               if (filter.value.length <= 0) {
  //                 return true;
  //               }
  //               // Formateamos el valor en caso de que llegue a ser un number
  //               const searchValue = isNaN(itemValue)
  //                 ? itemValue.toUpperCase()
  //                 : itemValue;

  //               return filter.value.includes(searchValue);

  //             case 'RANGE_NUMBER':
  //               const min = filter.value.min ? Number(filter.value.min) : null;
  //               const max = filter.value.max ? Number(filter.value.max) : null;

  //               if (min != null && max != null) {
  //                 return Number(itemValue) >= min && Number(itemValue) <= max;
  //               }
  //               if (min != null) {
  //                 return Number(itemValue) >= min;
  //               }
  //               if (max != null) {
  //                 return Number(itemValue) <= max;
  //               }
  //               return true;

  //             case 'RANGE_DATE':
  //               if (!filter.value.min || !filter.value.max) {
  //                 return true;
  //               }
  //               // Si no hay valor en el campo del registro, y el filtro de fecha busca un rango, lo filtramos
  //               if (!itemValue) {
  //                 return false;
  //               }

  //               return dayjs(itemValue).isBetween(
  //                 dayjs(filter.value.min),
  //                 dayjs(filter.value.max),
  //                 'day',
  //                 '[]',
  //               );
  //             default:
  //               return true;
  //           }
  //         },
  //       );
  //     });

  //     setTableDataSource(filteredData);
  //   },
  //   [products],
  // );

  const handleNewClient = () => {
    navigate(ROUTES.CLIENT_MANAGER_FORM);
  };

  const handleEdit = (record: ClientModel) => {
    navigate(ROUTES.CLIENT_MANAGER_FORM.replace(':client_id', record.id));
  };

  const handleDelete = (record: ClientModel) => {};

  useEffect(() => {
    const getProductsWithTypes = async () => {
      const clientsFetched = await window.electron.ipcMysql.getClients();
      const productsTypesFetched =
        await window.electron.ipcMysql.getProductTypes();
      setClients(clientsFetched);
      setTableDataSource(clientsFetched);
      setProductTypes(productsTypesFetched);

      setLoading(false);
    };

    getProductsWithTypes();
  }, []);

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
          dataSource={tableDataSource}
          clients={clients}
          productTypes={productTypes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Form>
    </AdminLayout>
  );
};

export default ClientManagerPage;
