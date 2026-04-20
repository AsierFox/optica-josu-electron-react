import { Alert, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import ClientModel from '../../../main/models/client.model';
import ExaminationTypeModel from '../../../main/models/examinationType.model';
import ProductModel from '../../../main/models/product.model';
import ProductTypeModel from '../../../main/models/productType.model';
import AdminLayout from '../../layouts/AdminLayout';
import ClientStats from './ClientStats';
import ProductStockStats from './ProductStockStats';

const StatisticsPage: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clients, setClients] = useState<ClientModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [productTypes, setProductTypes] = useState<ProductTypeModel[]>([]);
  const [examinationTypes, setExaminationTypes] = useState<
    ExaminationTypeModel[]
  >([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const clientsFetched = await window.electron.ipcMysql.getClients();
        const productsFetched = await window.electron.ipcMysql.getProducts();
        const productsTypesFetched =
          await window.electron.ipcMysql.getProductTypes();
        const examinationTypesFetched =
          await window.electron.ipcMysql.getExaminationTypes();

        setClients(clientsFetched);
        setProducts(productsFetched);
        setProductTypes(productsTypesFetched);
        setExaminationTypes(examinationTypesFetched);
      } catch {
        setErrorMessage('¡Error al obtener los productos de la Base de Datos!');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
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
      <Spin spinning={isLoading} size="large">
        <ClientStats clients={clients} />
        <ProductStockStats products={products} productTypes={productTypes} />
      </Spin>
    </AdminLayout>
  );
};

export default StatisticsPage;
