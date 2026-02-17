import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Alert, Button, Form, notification, Popconfirm, Space } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import ProductModel from '../../../main/models/product.model';
import ProductTypeModel from '../../../main/models/productType.model';
import AdminLayout from '../../layouts/AdminLayout';
import utils from '../../utils/util';
import ProductStockStats from './ProductStockStats';
import ProductStockTable from './ProductStockTable';

const ProductStockPage: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductModel | null>(
    null,
  );
  const [tableDataSource, setTableDataSource] = useState<ProductModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [productTypes, setProductTypes] = useState<ProductTypeModel[]>([]);
  const [searchFilter, setSearchFilter] = useState<{ proveedor: string }>({
    proveedor: '',
  });

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

  const handleSave = async () => {
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
  };

  const handleEdit = (record: ProductModel) => {
    form.setFieldsValue(prepareProductForTable(record));

    setEditingProduct(record);
  };

  const handleCancel = () => {
    if (editingProduct?.id.toString().startsWith(NEW_PRODUCT_ID_PREFIX)) {
      setTableDataSource(
        tableDataSource.filter((item) => item.id !== editingProduct.id),
      );
    }

    setEditingProduct(null);
    setErrorMessage(null);
  };

  const handleDelete = async (record: ProductModel) => {
    try {
      if (Number(record.id)) {
        await window.electron.ipcMysql.deleteProduct(Number(record.id));
      }
      setTableDataSource(
        tableDataSource.filter((item) => item.id !== record.id),
      );
    } catch (error) {
      setErrorMessage(`Error al eliminar producto: ${error}`);
    }
  };

  const getProductTypesOptionsForSelect = () => {
    return productTypes.map((productType) => ({
      value: productType.id,
      label: productType.type,
    }));
  };

  const columns = useMemo(() => {
    // Generar filtros únicos una sola vez por renderizado
    const proveedorFilters = utils
      .uniq(
        products.map((product: ProductModel) =>
          product.proveedor.toUpperCase(),
        ),
      )
      .map((filter) => ({ text: filter, value: filter }));

    const firmaFilters = utils
      .uniq(
        products.map((product: ProductModel) => product.firma.toUpperCase()),
      )
      .map((filter) => ({ text: filter, value: filter }));

    return [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: 'Proveedor',
        dataIndex: 'proveedor',
        filters: proveedorFilters,
        onFilter: (value: string, record: ProductModel) =>
          utils.equalsStrings(record.proveedor, value),
        sorter: (a: ProductModel, b: ProductModel) =>
          a.proveedor.localeCompare(b.proveedor),
        onCell: (record: ProductModel) => ({
          dataIndex: 'proveedor',
          record,
          editingProduct,
        }),
      },
      {
        title: 'Firma',
        dataIndex: 'firma',
        filters: firmaFilters,
        onFilter: (value: string, record: ProductModel) =>
          utils.equalsStrings(record.firma, value),
        sorter: (a: ProductModel, b: ProductModel) =>
          a.firma.localeCompare(b.firma),
        onCell: (record: ProductModel) => ({
          dataIndex: 'firma',
          record,
          editingProduct,
        }),
      },
      {
        title: 'Tipo de Producto',
        dataIndex: 'type',
        onFilter: (value: string, record: ProductModel) =>
          utils.equalsStrings(record.type, value),
        sorter: (a: ProductModel, b: ProductModel) =>
          a.type.localeCompare(b.type),
        onCell: (record: ProductModel) => ({
          dataIndex: 'typeId',
          type: 'select',
          record,
          editingProduct,
          selectOptions: getProductTypesOptionsForSelect(),
        }),
      },
      {
        title: 'Referencia',
        dataIndex: 'referencia',
        sorter: (a: ProductModel, b: ProductModel) =>
          a.referencia.localeCompare(b.referencia),
        onCell: (record: ProductModel) => ({
          dataIndex: 'referencia',
          record,
          editingProduct,
        }),
      },
      {
        title: 'Modelo y Color',
        dataIndex: 'modeloColor',
        sorter: (a: ProductModel, b: ProductModel) =>
          a.modeloColor.localeCompare(b.modeloColor),
        onCell: (record: ProductModel) => ({
          dataIndex: 'modeloColor',
          record,
          editingProduct,
        }),
      },
      {
        title: 'Calibre y Puente',
        dataIndex: 'calibrePuente',
        sorter: (a: ProductModel, b: ProductModel) =>
          a.calibrePuente.localeCompare(b.calibrePuente),
        onCell: (record: ProductModel) => ({
          dataIndex: 'calibrePuente',
          record,
          editingProduct,
        }),
      },
      {
        title: 'Fecha de Compra',
        dataIndex: 'fechaCompra',
        sorter: (a: ProductModel, b: ProductModel) =>
          dayjs(a.fechaCompra).unix() - dayjs(b.fechaCompra).unix(),
        onCell: (record: ProductModel) => ({
          dataIndex: 'fechaCompra',
          type: 'date',
          record,
          editingProduct,
        }),
      },
      {
        title: 'Precio de Compra',
        dataIndex: 'precioCompra',
        render: (_: any, record: ProductModel) =>
          record.precioCompra ? `${record.precioCompra} €` : null,
        onCell: (record: ProductModel) => ({
          dataIndex: 'precioCompra',
          type: 'money',
          record,
          editingProduct,
        }),
      },
      {
        title: 'Fecha de Venta',
        dataIndex: 'fechaVenta',
        onCell: (record: ProductModel) => ({
          dataIndex: 'fechaVenta',
          type: 'date',
          record,
          editingProduct,
        }),
      },
      {
        title: 'Precio de Venta',
        dataIndex: 'precioVenta',
        render: (_: any, record: ProductModel) =>
          record.precioVenta ? `${record.precioVenta} €` : null,
        onCell: (record: ProductModel) => ({
          dataIndex: 'precioVenta',
          type: 'money',
          record,
          editingProduct,
        }),
      },
      {
        title: 'Cantidad',
        dataIndex: 'cantidad',
        onCell: (record: ProductModel) => ({
          dataIndex: 'cantidad',
          type: 'number',
          record,
          editingProduct,
        }),
      },
      {
        title: 'Operaciones',
        fixed: 'right',
        render: (_: any, record: ProductModel) =>
          editingProduct?.id === record.id ? (
            <Space>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={handleSave}
              >
                Guardar
              </Button>
              <Popconfirm
                title="¿Desea cancelar la edición del producto?"
                onConfirm={() => handleCancel()}
              >
                <Button danger size="small" icon={<CloseOutlined />}>
                  Cancelar
                </Button>
              </Popconfirm>
            </Space>
          ) : (
            <Space>
              <Button
                size="small"
                color="cyan"
                variant="dashed"
                icon={<EditOutlined />}
                disabled={!!editingProduct}
                onClick={() => handleEdit(record)}
              >
                Editar
              </Button>
              <Popconfirm
                title="¿Desea borrar producto?"
                onConfirm={() => handleDelete(record)}
              >
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  disabled={!!editingProduct}
                >
                  Eliminar
                </Button>
              </Popconfirm>
            </Space>
          ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProduct, tableDataSource]);

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

  useEffect(() => {
    setTableDataSource(
      products.filter((row) =>
        row.proveedor
          .toUpperCase()
          .startsWith(searchFilter.proveedor.toUpperCase()),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilter]);

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
