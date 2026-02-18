import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Form, notification, Popconfirm, Space } from 'antd';
import { FilterValue } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import ProductModel from '../../../main/models/product.model';
import ProductTypeModel from '../../../main/models/productType.model';
import AdminLayout from '../../layouts/AdminLayout';
import ProductStockFilters from './ProductStockFilters';
import ProductStockStats from './ProductStockStats';
import ProductStockTable from './ProductStockTable';
import util from '../../utils/util';

// FIXME Al guardar el tipo y las fechas se pierden
const ProductStockPage: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductModel | null>(
    null,
  );
  const [tableDataSource, setTableDataSource] = useState<ProductModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [productTypes, setProductTypes] = useState<ProductTypeModel[]>([]);

  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  const NEW_PRODUCT_ID_PREFIX = 'temp_';

  const generateNewProductTableRow = () => {
    const newGeneratedId = NEW_PRODUCT_ID_PREFIX + Date.now();
    const newProduct: ProductModel = {
      id: newGeneratedId,
      proveedor: '',
      firma: '',
      referencia: '',
      modeloColor: '',
      typeId: 0,
      type: '',
      calibrePuente: '',
      precioCompra: null,
      precioVenta: null,
      cantidad: 1,
      fechaCompra: null,
      fechaVenta: null,
      createdAt: null,
      updatedAt: null,
    };

    // Limpiamos cualquier residuo de ediciones anteriores
    form.resetFields();
    setTableDataSource([newProduct, ...tableDataSource]);
    setEditingProduct(newProduct);
  };

  const prepareProductForDDBB = (product: ProductModel) => ({
    ...product,
    fechaCompra: product.fechaCompra?.format('YYYY-MM-DD'),
    fechaVenta: product.fechaVenta?.format('YYYY-MM-DD'),
  });

  const prepareProductForTable = (product: ProductModel) => ({
    ...product,
    fechaCompra: product?.fechaCompra ? dayjs(product?.fechaCompra) : null,
    fechaVenta: product?.fechaVenta ? dayjs(product?.fechaVenta) : null,
  });

  const getProductTypesOptionsForSelect = () => {
    return productTypes.map((productType) => ({
      value: productType.id,
      label: productType.type,
    }));
  };

  const handleFilter = useCallback(
    (filters: Readonly<Record<string, FilterValue>>) => {
      const filteredData = products.filter((item) => {
        return Object.entries(filters).every(([key, filter]) => {
          const searchFilter = filters[key];
          // Si no hay filtro, no filtramos
          switch (searchFilter.type) {
            case 'SINGLE':
              if (!searchFilter.value) {
                return true;
              }
              return util.includesStrings(
                item[searchFilter.targetKey],
                searchFilter.value,
              );
            // Casuistica para busqueda por array
            case 'MULTIPLE':
              if (searchFilter.value.length <= 0) {
                return true;
              }
              const itemValue = item[searchFilter.targetKey];
              // Formateamos el valor en caso de que llegue a ser un number
              const searchValue = isNaN(itemValue)
                ? itemValue.toUpperCase()
                : itemValue;

              return searchFilter.value.includes(searchValue);
            default:
              return true;
          }
        });
      });

      setTableDataSource(filteredData);
    },
    [products],
  );

  const handleSave = useCallback(async () => {
    if (!editingProduct) {
      setErrorMessage('Error al guardar producto: handleSave NULL');
      return;
    }
    try {
      const newValues = await form.validateFields();
      const finalProduct: ProductModel = { ...editingProduct, ...newValues };

      const isNewProduct = editingProduct.id
        .toString()
        .startsWith(NEW_PRODUCT_ID_PREFIX);

      if (isNewProduct) {
        const newProductId = await window.electron.ipcMysql.createProduct(
          prepareProductForDDBB(finalProduct),
        );
        finalProduct.id = newProductId;
      } else {
        await window.electron.ipcMysql.updateProduct(
          prepareProductForDDBB(finalProduct),
        );
      }

      // Actualizamos tabla sin recargar
      const newDataSource = tableDataSource.map((product: ProductModel) =>
        product.id === editingProduct.id ? finalProduct : product,
      );

      setTableDataSource(newDataSource);
      setProducts(newDataSource);
      setEditingProduct(null);

      api.success({
        placement: 'top',
        message: `¡Producto ${isNewProduct ? 'creado' : 'editado'} satisfactoriamente!`,
      });
    } catch (error) {
      if (error && error.errorFields) {
        setErrorMessage('Por favor, revisa los campos marcados en rojo.');
        return;
      }
      setErrorMessage(
        `Error de conexión con base de datos: ${error.message || error}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProduct, form, api]);

  const handleEdit = useCallback(
    (record: ProductModel) => {
      form.setFieldsValue(prepareProductForTable(record));

      setEditingProduct(record);
    },
    [form],
  );

  const handleCancel = useCallback(() => {
    if (editingProduct?.id.toString().startsWith(NEW_PRODUCT_ID_PREFIX)) {
      setTableDataSource(
        tableDataSource.filter((item) => item.id !== editingProduct.id),
      );
    }

    setEditingProduct(null);
    setErrorMessage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProduct]);

  const handleDelete = useCallback(
    async (record: ProductModel) => {
      try {
        if (Number(record.id)) {
          await window.electron.ipcMysql.deleteProduct(Number(record.id));
        }
        const productsWithRemovedOne = tableDataSource.filter(
          (item: ProductModel) => item.id !== record.id,
        );
        setTableDataSource(productsWithRemovedOne);
        setProducts(productsWithRemovedOne);
      } catch (error) {
        setErrorMessage(`Error al eliminar producto: ${error}`);
      }
    },
    [tableDataSource],
  );

  useEffect(() => {
    const getProductsWithTypes = async () => {
      const productsFetched = await window.electron.ipcMysql.getProducts();
      const productsTypesFetched =
        await window.electron.ipcMysql.getProductTypes();
      setProducts(productsFetched);
      setTableDataSource(productsFetched);
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

      <ProductStockFilters
        products={products}
        productTypes={productTypes}
        onFilterChange={handleFilter}
      />

      <Space size="middle" style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          disabled={!!editingProduct}
          onClick={generateNewProductTableRow}
        >
          Agregar Producto
        </Button>
        <Popconfirm
          title="¿Desea cancelar la edición del producto?"
          onConfirm={() => handleCancel()}
        >
          <Button danger icon={<CloseOutlined />} disabled={!editingProduct}>
            Cancelar Ediciones
          </Button>
        </Popconfirm>
      </Space>

      <Form form={form} component={false}>
        <ProductStockTable
          loading={isLoading}
          dataSource={tableDataSource}
          products={products}
          editingProduct={editingProduct}
          productTypesOptions={getProductTypesOptionsForSelect()}
          onSave={handleSave}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      </Form>

      <ProductStockStats products={products} productTypes={productTypes} />
    </AdminLayout>
  );
};

export default ProductStockPage;
