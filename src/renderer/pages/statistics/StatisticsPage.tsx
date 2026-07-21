import { Alert, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import CustomerModel from '../../../main/models/customer.model';
import ExaminationTypeModel from '../../../main/models/examinationType.model';
import ProductModel from '../../../main/models/product.model';
import ProductTypeModel from '../../../main/models/productType.model';
import AdminLayout from '../../layouts/AdminLayout';
import CustomerStats from './CustomerStats';
import ProductStockStats from './ProductStockStats';

const StatisticsPage: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [productTypes, setProductTypes] = useState<ProductTypeModel[]>([]);
  const [examinationTypes, setExaminationTypes] = useState<
    ExaminationTypeModel[]
  >([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const customersFetched = await window.electron.ipcMysql.getCustomers();
        const productsFetched = await window.electron.ipcMysql.getAllProducts();
        const productsTypesFetched =
          await window.electron.ipcMysql.getProductTypes();
        const examinationTypesFetched =
          await window.electron.ipcMysql.getExaminationTypes();

        setCustomers(customersFetched);
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
        <CustomerStats customers={customers} />
        <ProductStockStats products={products} productTypes={productTypes} />
      </Spin>
    </AdminLayout>
  );
};

export default StatisticsPage;
