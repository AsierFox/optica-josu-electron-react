import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Form, notification, Popconfirm, Space } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import React, { useCallback, useEffect, useState } from 'react';
import ProductModel from '../../../main/models/product.model';
import ProductTypeModel from '../../../main/models/productType.model';
import { NEW_ROW_ID_PREFIX } from '../../app/constants';
import AdminLayout from '../../layouts/AdminLayout';
import util from '../../utils/util';
import ProductStockFilters from './ProductStockFilters';
import { ProductStockFilterValue } from './ProductStockFilterValue';
import ProductStockStats from './ProductStockStats';
import ProductStockTable from './ProductStockTable';

dayjs.extend(isBetween);

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

  const generateNewProductTableRow = () => {
    const newProduct: ProductModel = new ProductModel();

    // Limpiamos cualquier residuo de ediciones anteriores
    form.resetFields();
    form.setFieldsValue(newProduct);

    setTableDataSource([newProduct, ...tableDataSource]);
    setEditingProduct(newProduct);
  };

  const prepareProductForDDBB = (product: ProductModel) => ({
    ...product,
    fechaCompra: product.fechaCompra?.format('YYYY-MM-DD'),
    fechaVenta: product.fechaVenta?.format('YYYY-MM-DD'),
  });

  const prepareProductForEditOnTable = (
    product: ProductModel,
  ): ProductModel => ({
    ...product,
    fechaCompra: product?.fechaCompra ? dayjs(product?.fechaCompra) : null,
    fechaVenta: product?.fechaVenta ? dayjs(product?.fechaVenta) : null,
  });

  const handleFilter = useCallback(
    (filters: Readonly<Record<string, ProductStockFilterValue>>) => {
      const filteredData = products.filter((item) => {
        return Object.values(filters).every(
          (filter: ProductStockFilterValue) => {
            const itemValue = item[filter.targetKey];

            switch (filter.type) {
              case 'SINGLE':
                if (!filter.value) {
                  return true;
                }
                return util.includesStrings(itemValue, filter.value);

              case 'MULTIPLE':
                if (filter.value.length <= 0) {
                  return true;
                }
                // Formateamos el valor en caso de que llegue a ser un number
                const searchValue = isNaN(itemValue)
                  ? itemValue.toUpperCase()
                  : itemValue;

                return filter.value.includes(searchValue);

              case 'RANGE_NUMBER':
                const min = filter.value.min ? Number(filter.value.min) : null;
                const max = filter.value.max ? Number(filter.value.max) : null;

                if (min != null && max != null) {
                  return Number(itemValue) >= min && Number(itemValue) <= max;
                }
                if (min != null) {
                  return Number(itemValue) >= min;
                }
                if (max != null) {
                  return Number(itemValue) <= max;
                }
                return true;

              case 'RANGE_DATE':
                if (!filter.value.min || !filter.value.max) {
                  return true;
                }
                // Si no hay valor en el campo del registro, y el filtro de fecha busca un rango, lo filtramos
                if (!itemValue) {
                  return false;
                }

                return dayjs(itemValue).isBetween(
                  dayjs(filter.value.min),
                  dayjs(filter.value.max),
                  'day',
                  '[]',
                );
              default:
                return true;
            }
          },
        );
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
      setLoading(true);

      const newValues = await form.validateFields();
      const finalProduct: ProductModel = { ...editingProduct, ...newValues };

      const isNewProduct = editingProduct.id
        .toString()
        .startsWith(NEW_ROW_ID_PREFIX);

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

      // Buscamos el registro nuevo o editado para actualizar en el array de la tabla y el listado de la BBDD original,
      // sin tener que actualizar recargando la tabla entera.
      // @ts-ignore
      setTableDataSource((prevTableDataSource: ProductModel[]) =>
        prevTableDataSource.map((product: ProductModel) =>
          product.id === editingProduct.id
            ? {
                ...finalProduct,
                type: productTypes.find(
                  (productType: ProductTypeModel) =>
                    productType.id === finalProduct.typeId,
                )?.type,
                fechaCompra: finalProduct.fechaCompra
                  ? util.formatDateToYYYYMMDD(dayjs(finalProduct.fechaCompra))
                  : null,
                fechaVenta: finalProduct.fechaVenta
                  ? util.formatDateToYYYYMMDD(dayjs(finalProduct.fechaVenta))
                  : null,
              }
            : product,
        ),
      );

      // Actualizamos el listado de la tabla original con el nuevo producto editado o creado,
      // para evitar recargar la tabla entera a traves de la BBDD.
      // @ts-ignore
      setProducts((prevTableDataSource: ProductModel[]) =>
        prevTableDataSource.map((product: ProductModel) =>
          product.id === editingProduct.id
            ? {
                ...finalProduct,
                type: productTypes.find(
                  (productType: ProductTypeModel) =>
                    productType.id === finalProduct.typeId,
                )?.type,
                fechaCompra: finalProduct.fechaCompra
                  ? util.formatDateToYYYYMMDD(dayjs(finalProduct.fechaCompra))
                  : null,
                fechaVenta: finalProduct.fechaVenta
                  ? util.formatDateToYYYYMMDD(dayjs(finalProduct.fechaVenta))
                  : null,
              }
            : product,
        ),
      );
      setEditingProduct(null);

      api.success({
        placement: 'top',
        message: `¡Producto ${isNewProduct ? 'creado' : 'editado'} satisfactoriamente!`,
      });
    } catch (error) {
      if (error && error?.errorFields) {
        setErrorMessage('Por favor, revisa los campos marcados en rojo.');
        return;
      }
      setErrorMessage(
        `Error de conexión con base de datos: ${error.message || error}`,
      );
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProduct, form, api]);

  const handleEdit = useCallback(
    (record: ProductModel) => {
      form.setFieldsValue(prepareProductForEditOnTable(record));

      setEditingProduct(record);
    },
    [form],
  );

  const handleCancel = useCallback(() => {
    if (editingProduct?.id.toString().startsWith(NEW_ROW_ID_PREFIX)) {
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
      try {
        const productsFetched = await window.electron.ipcMysql.getProducts();
        const productsTypesFetched =
          await window.electron.ipcMysql.getProductTypes();

        setProducts(productsFetched);
        setTableDataSource(productsFetched);
        setProductTypes(productsTypesFetched);
      } catch {
        setErrorMessage('¡Error al obtener los productos de la Base de Datos!');
      } finally {
        setLoading(false);
      }
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
        allDisabled={!!editingProduct}
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
          productTypes={productTypes}
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
