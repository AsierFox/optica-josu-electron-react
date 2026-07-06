import {
  CloseOutlined,
  FileExcelOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Divider,
  Form,
  notification,
  Popconfirm,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import React, { useCallback, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import ProductModel from '../../../main/models/product.model';
import ProductTypeModel from '../../../main/models/productType.model';
import { NEW_ROW_ID_PREFIX } from '../../app/constants';
import AdminLayout from '../../layouts/AdminLayout';
import util from '../../utils/util';
import ProductStockFilters from './ProductStockFilters';
import { ProductStockFilterValue } from './ProductStockFilterValue';
import ProductStockTable from './ProductStockTable';

const { Text } = Typography;

dayjs.extend(isBetween);

const ProductStockPage: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tableDataSource, setTableDataSource] = useState<ProductModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [productTypes, setProductTypes] = useState<ProductTypeModel[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductModel | null>(
    null,
  );

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

  const prepareProductForDDBB = (product: ProductModel): ProductModel => ({
    ...product,
    fechaCompra: product.fechaCompra?.format('YYYY-MM-DD'),
    fechaVenta: product.sale?.fechaVenta?.format('YYYY-MM-DD'),
    createNewProduct: product.createNewProduct,
    createNewProductFromDDBB: product.createNewProductFromDDBB,
  });

  const prepareProductForReadOnTable = (
    product: ProductModel,
  ): ProductModel => ({
    ...product,
    type:
      productTypes.find(
        (productType: ProductTypeModel) => productType.id === product.typeId,
      )?.type || null,
    fechaCompra: product.fechaCompra
      ? util.formatDateToYYYYMMDD(dayjs(product.fechaCompra))
      : null,
    fechaVenta: product.sale?.fechaVenta
      ? util.formatDateToYYYYMMDD(dayjs(product.sale?.fechaVenta))
      : null,
    createNewProduct: product.createNewProduct,
    createNewProductFromDDBB: product.createNewProductFromDDBB,
  });

  const prepareProductForEditOnTable = (
    product: ProductModel,
  ): ProductModel => ({
    ...product,
    fechaCompra: product?.fechaCompra ? dayjs(product?.fechaCompra) : null,
    sale: {
      fechaVenta: product.sale?.fechaVenta
        ? dayjs(product.sale?.fechaVenta)
        : null,
    },
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

              case 'MULTIPLE': {
                if (filter.value.length <= 0) {
                  return true;
                }
                // Formateamos el valor en caso de que llegue a ser un number
                const searchValue = Number.isNaN(itemValue)
                  ? itemValue.toUpperCase()
                  : itemValue;

                return filter.value.includes(searchValue);
              }

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

      const finalProductPreparedForTable =
        prepareProductForReadOnTable(finalProduct);

      if (isNewProduct) {
        // Si es nuevo producto, lo añadimos al principio del array y eliminamos la linea temporal
        setTableDataSource((prevTableDataSource: ProductModel[]) => [
          finalProductPreparedForTable,
          ...prevTableDataSource.filter(
            (product: ProductModel) =>
              !product.id.toString().startsWith(NEW_ROW_ID_PREFIX),
          ),
        ]);
        setProducts((prevTableDataSource: ProductModel[]) => [
          finalProductPreparedForTable,
          ...prevTableDataSource.filter(
            (product: ProductModel) =>
              !product.id.toString().startsWith(NEW_ROW_ID_PREFIX),
          ),
        ]);
      } else {
        // Si es una edición, actualizamos el producto editado en su posición dentro del array:
        // Buscamos el registro nuevo o editado para actualizar en el array de la tabla y el listado de la BBDD original,
        // sin tener que actualizar recargando la tabla entera.
        // @ts-ignore
        setTableDataSource((prevTableDataSource: ProductModel[]) =>
          prevTableDataSource.map((product: ProductModel) =>
            product.id === editingProduct.id
              ? finalProductPreparedForTable
              : product,
          ),
        );

        // Actualizamos el listado de la tabla original con el nuevo producto editado o creado,
        // para evitar recargar la tabla entera a traves de la BBDD.
        // @ts-ignore
        setProducts((prevTableDataSource: ProductModel[]) =>
          prevTableDataSource.map((product: ProductModel) =>
            product.id === editingProduct.id
              ? finalProductPreparedForTable
              : product,
          ),
        );
      }

      setEditingProduct(null);

      api.success({
        message: `¡Producto ${isNewProduct ? 'creado' : 'editado'} satisfactoriamente!`,
      });
    } catch (error: any) {
      if (error && error?.errorFields) {
        api.warning({
          message: 'Por favor, revisa los campos marcados en rojo.',
        });
        return;
      }
      const errorMsg = `Error de conexión con base de datos: ${error?.message || error}`;
      api.error({
        message: errorMsg,
      });
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [api, form, editingProduct]);

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
        api.success({
          message: '¡Producto eliminado!',
        });
      } catch (error: any) {
        const errorMsg = `Error al eliminar producto: ${error?.message || error}`;
        api.error({
          message: 'Error',
          description: errorMsg,
        });
        setErrorMessage(errorMsg);
      }
    },
    [api, tableDataSource],
  );

  const handleExportExcel = useCallback(() => {
    setLoading(true);

    const worksheet = XLSX.utils.json_to_sheet(
      tableDataSource.map((product) => ({
        PROVEEDOR: product.proveedor,
        FIRMA: product.firma,
        'TIPO DE GAFA': product.type,
        REFERENCIA: product.referencia,
        MODELO: product.modelo,
        COLOR: product.color,
        'CALIBRE Y PUENTE': product.calibrePuente,
        'FECHA DE COMPRA': product.fechaCompra,
        'PRECIO DE COMPRA': product.precioCompra,
        'FECHA DE VENTA': product.sale?.fechaVenta,
        'PRECIO DE VENTA': product.precioVenta,
        OBSERVACIONES: product.notes,
      })),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
    XLSX.writeFile(workbook, 'PRODUCTOS_EXPORTADOS.xlsx');

    setLoading(false);
    api.success({
      message: '¡Productos exportados a Excel satisfactoriamente!',
    });
  }, [api, tableDataSource]);

  useEffect(() => {
    const getProductsWithTypes = async () => {
      try {
        const productsFetched =
          await window.electron.ipcMysql.getProductsWithSales();
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

      <Text strong style={{ fontSize: '15px', color: '#141414' }}>
        Gestión de Inventario
      </Text>

      <Divider />

      <ProductStockFilters
        allDisabled={!!editingProduct}
        products={products}
        productTypes={productTypes}
        onFilterChange={handleFilter}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
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
            <Button
              danger
              icon={<CloseOutlined />}
              style={{ display: editingProduct ? '' : 'none' }}
              disabled={!editingProduct}
            >
              Cancelar Creación / Edición
            </Button>
          </Popconfirm>
        </div>
        <Button
          icon={<FileExcelOutlined />}
          disabled={!!editingProduct}
          onClick={handleExportExcel}
          style={{
            backgroundColor: '#217346',
            borderColor: '#217346',
            color: '#ffffff',
            fontWeight: '500',
          }}
        >
          Exportar a Excel
        </Button>
      </div>

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
    </AdminLayout>
  );
};

export default ProductStockPage;
