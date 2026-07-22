import {
  CalendarOutlined,
  CloseOutlined,
  PlusOutlined,
  RightOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Modal,
  notification,
  Popconfirm,
  Row,
  Space,
  Tag,
  Typography
} from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import OrderModel from '../../../main/models/order.model';
import ProductModel from '../../../main/models/product.model';
import ProductTypeModel from '../../../main/models/productType.model';
import {
  NEW_ROW_ID_PREFIX,
  PRODUCT_STOCK_TYPE,
  ROUTES,
} from '../../app/constants';
import ProductStockTable from '../../components/ProductStockTable';
import { TableFilterValueType } from '../../components/TableFilterValueType';
import AdminLayout from '../../layouts/AdminLayout';
import util from '../../utils/util';
import ProductMonturaStockFilters from './ProductMonturaStockFilters';
import ProductTableColumns from './ProductTableColumns';

const { Text } = Typography;

const ProductStockTablePage: React.FC<{
  type: PRODUCT_STOCK_TYPE;
}> = ({ type }) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tableDataSource, setTableDataSource] = useState<ProductModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [productTypes, setProductTypes] = useState<ProductTypeModel[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductModel | null>(
    null,
  );
  const [productOrders, setProductOrders] = useState<OrderModel[]>([]);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const generateNewProductTableRow = () => {
    const newProduct: ProductModel = util.generateNewTempProductByType(type);

    // Limpiamos cualquier residuo de ediciones anteriores
    form.resetFields();
    form.setFieldsValue(newProduct);

    setTableDataSource([newProduct, ...tableDataSource]);
    setEditingProduct(newProduct);
  };

  const formatProductDateForDDBB = (
    date: string | dayjs.Dayjs | null | undefined,
  ): string | null => (date ? dayjs(date).format('YYYY-MM-DD') : null);

  const prepareProductForDDBB = useCallback(
    (product: ProductModel): ProductModel => ({
      ...product,
      fechaCompra: formatProductDateForDDBB(product.fechaCompra),
    }),
    [],
  );

  const prepareProductForReadOnTable = useCallback(
    (product: ProductModel): ProductModel => ({
      ...product,
      type:
        productTypes.find(
          (productType: ProductTypeModel) => productType.id === product.typeId,
        )?.type ?? null,
      fechaCompra: product.fechaCompra
        ? util.formatDateToYYYYMMDD(dayjs(product.fechaCompra))
        : null,
    }),
    [productTypes],
  );

  const prepareProductForEditOnTable = (product: ProductModel) => ({
    ...product,
    fechaCompra: product?.fechaCompra ? dayjs(product?.fechaCompra) : null,
  });

  const handleSave = useCallback(async () => {
    if (!editingProduct) {
      setErrorMessage('Error al guardar producto: handleSave NULL');
      return;
    }
    try {
      setLoading(true);

      const newValues = await form.validateFields();
      const finalProduct: ProductModel = {
        ...editingProduct,
        ...newValues,
      };

      const isNewProduct = editingProduct.id
        .toString()
        .startsWith(NEW_ROW_ID_PREFIX);

      if (isNewProduct) {
        const newProductId = await window.electron.ipcMysql.createProduct(
          type,
          prepareProductForDDBB(finalProduct),
        );

        finalProduct.id = newProductId.toString();
      } else {
        await window.electron.ipcMysql.updateProduct(
          type,
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
  }, [
    api,
    form,
    type,
    editingProduct,
    prepareProductForReadOnTable,
    prepareProductForDDBB,
  ]);

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
        const recordId = Number(record.id);
        if (recordId) {
          await window.electron.ipcMysql.deleteProduct(type, recordId);
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
    [api, type, tableDataSource],
  );

  useEffect(() => {
    const getProductTypes = async () => {
      try {
        const productTypesFetched =
          await window.electron.ipcMysql.getProductTypes();

        setProductTypes(productTypesFetched);
      } catch (error) {
        setErrorMessage(
          `Error al obtener los tipos de productos de la Base de Datos: ${error}`,
        );
      } finally {
        setLoading(false);
      }
    };

    const getProductMonturas = async () => {
      try {
        const productsFetched =
          await window.electron.ipcMysql.getProductsCheckingOrders(type);

        setProducts(productsFetched);
        setTableDataSource(productsFetched);
      } catch (error) {
        setErrorMessage(
          `Error al obtener los productos montura de la Base de Datos: ${error}`,
        );
      } finally {
        setLoading(false);
      }
    };

    getProductTypes();
    getProductMonturas();
  }, [type]);

  const handleShowProductOrder = useCallback(
    async (record: ProductModel) => {
      try {
        const recordId = Number(record.id);
        const productOrdersDDBB =
          await window.electron.ipcMysql.getOrdersByProductId(recordId);

        setProductOrders(productOrdersDDBB);
        setIsOrdersModalOpen(true);
      } catch (error: any) {
        const errorMsg = `Error al obtener los pedidos del producto: ${error?.message || error}`;
        api.error({
          message: 'Error',
          description: errorMsg,
        });
        setErrorMessage(errorMsg);
      }
    },
    [api],
  );

  const handleFilter = useCallback(
    (filters: Readonly<Record<string, TableFilterValueType>>) => {
      const filteredData = products.filter((item) => {
        return Object.values(filters).every((filter: TableFilterValueType) => {
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
        });
      });

      setTableDataSource(filteredData);
    },
    [products],
  );

  const handleExportExcel = useCallback(() => {
    setLoading(true);

    const worksheet = XLSX.util.json_to_sheet(
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
        OBSERVACIONES: product.notes,
      })),
    );
    const workbook = XLSX.util.book_new();
    XLSX.util.book_append_sheet(workbook, worksheet, 'Productos');
    XLSX.writeFile(workbook, 'PRODUCTOS_EXPORTADOS.xlsx');

    setLoading(false);
    api.success({
      message: '¡Productos exportados a Excel satisfactoriamente!',
    });
  }, [api, tableDataSource]);

  const columns = ProductTableColumns(
    type,
    products,
    productTypes,
    editingProduct,
    handleShowProductOrder,
    handleSave,
    handleCancel,
    handleEdit,
    handleDelete,
  );

  const getTypeLabel = () => {
    switch (type) {
      case PRODUCT_STOCK_TYPE.MONTURA:
        return 'Monturas';
      case PRODUCT_STOCK_TYPE.LENTE_LENTILLA:
        return 'Lentes y Lentillas';
      default:
        return 'Genérico';
    }
  };

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
        Gestión de Inventario de {getTypeLabel()}
      </Text>

      <Divider />

      {type === PRODUCT_STOCK_TYPE.MONTURA ? (
        <ProductMonturaStockFilters
          allDisabled={!!editingProduct}
          products={products}
          productTypes={productTypes}
          onFilterChange={handleFilter}
        />
      ) : null}

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
      </div>

      <Form form={form} component={false}>
        <ProductStockTable
          loading={isLoading}
          columns={columns()}
          dataSource={tableDataSource}
        />
      </Form>

      <Modal
        title="Pedidos del producto"
        open={isOrdersModalOpen}
        width={900}
        onCancel={() => setIsOrdersModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsOrdersModalOpen(false)}>
            Cerrar
          </Button>,
        ]}
      >
        <Row gutter={[16, 16]}>
          {productOrders.map((order) => (
            <Col xs={24} sm={24} md={12} key={order.id}>
              <Card
                hoverable
                size="small"
                style={{ height: '100%', cursor: 'pointer' }}
                onClick={() =>
                  navigate(
                    ROUTES.CUSTOMERS_MANAGER_FORM.replace(
                      ':customer_id',
                      order.customerId?.toString(),
                    ),
                  )
                }
              >
                <Card.Meta
                  avatar={
                    <Avatar
                      icon={<ShoppingOutlined />}
                      style={{ backgroundColor: '#1677ff' }}
                    />
                  }
                  title={
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Text>ID Pedido {order.id}</Text>

                      <Space size={8}>
                        {order.status && (
                          <Tag color="green">{order.status}</Tag>
                        )}
                        <RightOutlined style={{ color: '#8c8c8c' }} />
                      </Space>
                    </div>
                  }
                  description={
                    <Space direction="vertical" size={4}>
                      <Text>
                        <CalendarOutlined style={{ marginRight: 6 }} />
                        Fecha: {dayjs(order.fechaVenta).format('DD/MM/YYYY')}
                      </Text>

                      <Button type="link">
                        Pulsa para ir a la ficha del cliente
                      </Button>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>
    </AdminLayout>
  );
};

export default ProductStockTablePage;
