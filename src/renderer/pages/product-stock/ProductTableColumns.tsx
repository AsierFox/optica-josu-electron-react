import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Space } from 'antd';
import dayjs from 'dayjs';
import ProductModel from '../../../main/models/product.model';
import ProductTypeModel from '../../../main/models/productType.model';
import { PRODUCT_FIELD_NAMES, PRODUCT_STOCK_TYPE } from '../../app/constants';
import util from '../../utils/util';

const ProductTableColumns =
  (
    type: PRODUCT_STOCK_TYPE,
    products: ProductModel[],
    productTypes: ProductTypeModel[],
    editingProduct: ProductModel | null,
    handleShowProductSale: (product: ProductModel) => Promise<void>,
    handleSave: () => void,
    handleCancel: () => void,
    handleEdit: (product: ProductModel) => void,
    handleDelete: (product: ProductModel) => void,
  ): any =>
  () => {
    const proveedorFilters = util
      .uniq(
        products
          .filter((p) => p.proveedor)
          .map((product: ProductModel) => product.proveedor?.toUpperCase()),
      )
      .map((filter: string) => ({ text: filter, value: filter }));

    const firmaFilters = util
      .uniq(
        products
          .filter((p) => p.firma)
          .map((product: ProductModel) => product.firma?.toUpperCase()),
      )
      .map((filter: string) => ({ text: filter, value: filter }));

    const productTypeFilters = productTypes.map(
      (productType: ProductTypeModel) => ({
        text: productType.type,
        value: productType.id,
      }),
    );

    const productTypesSelectOptions = productTypes.map(
      (productType: ProductTypeModel) => ({
        value: productType.id,
        label: productType.type,
      }),
    );

    const MONTURA_COLUMNS = [
      {
        title: PRODUCT_FIELD_NAMES.proveedor,
        dataIndex: 'proveedor',
        filters: !editingProduct ? proveedorFilters : false,
        filterSearch: true,
        onFilter: (value: string, record: ProductModel) =>
          util.equalsStrings(record.proveedor ?? '', value),
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              a.proveedor?.localeCompare(b?.proveedor ?? '')
          : false,
        onCell: (record: ProductModel) => ({
          dataIndex: 'proveedor',
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.firma,
        dataIndex: 'firma',
        filters: !editingProduct ? firmaFilters : false,
        filterSearch: true,
        onFilter: (value: string, record: ProductModel) =>
          util.equalsStrings(record.firma ?? '', value),
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              a.firma?.localeCompare(b?.firma ?? '')
          : false,
        onCell: (record: ProductModel) => ({
          dataIndex: 'firma',
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.referencia,
        dataIndex: 'referencia',
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              a.referencia?.localeCompare(b?.referencia)
          : false,
        onCell: (record: ProductModel) => ({
          dataIndex: 'referencia',
          required: true,
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.modelo,
        dataIndex: 'modelo',
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              a.modelo?.localeCompare(b?.modelo ?? '')
          : false,
        onCell: (record: ProductModel) => ({
          dataIndex: 'modelo',
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.color,
        dataIndex: 'color',
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              a.color?.localeCompare(b?.color ?? '')
          : false,
        onCell: (record: ProductModel) => ({
          dataIndex: 'color',
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.calibrePuente,
        dataIndex: 'calibrePuente',
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              a.calibrePuente?.localeCompare(b?.calibrePuente ?? '')
          : false,
        onCell: (record: ProductModel) => ({
          dataIndex: 'calibrePuente',
          record,
          editingProduct,
        }),
      },
    ];

    const LENTILLA_LENTE_COLUMNS = [
      {
        title: PRODUCT_FIELD_NAMES.numeroPedido,
        dataIndex: 'numeroPedido',
        filterSearch: true,
        onFilter: (value: string, record: ProductModel) =>
          util.equalsStrings(record.numeroPedido ?? '', value),
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              a.numeroPedido?.localeCompare(b?.numeroPedido ?? '')
          : false,
        onCell: (record: ProductModel) => ({
          dataIndex: 'numeroPedido',
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.odGraduacion,
        dataIndex: 'odGraduacion',
        filterSearch: true,
        onFilter: (value: string, record: ProductModel) =>
          util.equalsStrings(record.odGraduacion ?? '', value),
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              a.odGraduacion?.localeCompare(b?.odGraduacion ?? '')
          : false,
        onCell: (record: ProductModel) => ({
          dataIndex: 'odGraduacion',
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.oiGraduacion,
        dataIndex: 'oiGraduacion',
        filterSearch: true,
        onFilter: (value: string, record: ProductModel) =>
          util.equalsStrings(record.oiGraduacion ?? '', value),
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              a.oiGraduacion?.localeCompare(b?.oiGraduacion ?? '')
          : false,
        onCell: (record: ProductModel) => ({
          dataIndex: 'oiGraduacion',
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.odAdicion,
        dataIndex: 'odAdicion',
        filterSearch: true,
        onFilter: (value: string, record: ProductModel) =>
          util.equalsStrings(record.odAdicion ?? '', value),
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              a.odAdicion?.localeCompare(b?.odAdicion ?? '')
          : false,
        onCell: (record: ProductModel) => ({
          dataIndex: 'odAdicion',
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.oiAdicion,
        dataIndex: 'oiAdicion',
        filterSearch: true,
        onFilter: (value: string, record: ProductModel) =>
          util.equalsStrings(record.oiAdicion ?? '', value),
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              a.oiAdicion?.localeCompare(b?.oiAdicion ?? '')
          : false,
        onCell: (record: ProductModel) => ({
          dataIndex: 'oiAdicion',
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.odPrisma,
        dataIndex: 'odPrisma',
        filterSearch: true,
        onFilter: (value: string, record: ProductModel) =>
          util.equalsStrings(record.odPrisma ?? '', value),
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              a.odPrisma?.localeCompare(b?.odPrisma ?? '')
          : false,
        onCell: (record: ProductModel) => ({
          dataIndex: 'odPrisma',
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.oiPrisma,
        dataIndex: 'oiPrisma',
        filterSearch: true,
        onFilter: (value: string, record: ProductModel) =>
          util.equalsStrings(record.oiPrisma ?? '', value),
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              a.oiPrisma?.localeCompare(b?.oiPrisma ?? '')
          : false,
        onCell: (record: ProductModel) => ({
          dataIndex: 'oiPrisma',
          record,
          editingProduct,
        }),
      },
    ];

    const GENERICO_COLUMNS = [
      {
        title: PRODUCT_FIELD_NAMES.description,
        dataIndex: 'description',
        filterSearch: true,
        onFilter: (value: string, record: ProductModel) =>
          util.equalsStrings(record.description ?? '', value),
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              a.description?.localeCompare(b?.description ?? '')
          : false,
        onCell: (record: ProductModel) => ({
          dataIndex: 'description',
          record,
          editingProduct,
        }),
      },
    ];

    const getColumnsByProductType = () => {
      switch (type) {
        case PRODUCT_STOCK_TYPE.MONTURA:
          return MONTURA_COLUMNS;
        case PRODUCT_STOCK_TYPE.LENTE_LENTILLA:
          return LENTILLA_LENTE_COLUMNS;
        case PRODUCT_STOCK_TYPE.GENERICO:
        default:
          return GENERICO_COLUMNS;
      }
    };

    return [
      {
        title: PRODUCT_FIELD_NAMES.id,
        dataIndex: 'id',
      },
      {
        title: PRODUCT_FIELD_NAMES.type,
        dataIndex: 'type',
        filters: !editingProduct ? productTypeFilters : false,
        filterSearch: true,
        onFilter: (value: string, record: ProductModel) =>
          util.equalsStrings(record.type ?? '', value),
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              a.type?.localeCompare(b?.type ?? '')
          : false,
        onCell: (record: ProductModel) => ({
          dataIndex: 'typeId',
          required: true,
          type: 'select',
          record,
          editingProduct,
          selectOptions: productTypesSelectOptions,
        }),
      },
      ...getColumnsByProductType(),
      {
        title: PRODUCT_FIELD_NAMES.fechaCompra,
        dataIndex: 'fechaCompra',
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              dayjs(a.fechaCompra).unix() - dayjs(b.fechaCompra).unix()
          : false,
        render: (value: string) =>
          // @ts-ignore
          value ? util.formatDateToYYYYMMDD(value) : null,
        onCell: (record: ProductModel) => ({
          dataIndex: 'fechaCompra',
          type: 'date',
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.precioCompra,
        dataIndex: 'precioCompra',
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              (a.precioCompra || 0) - (b.precioCompra || 0)
          : false,
        render: (_: any, record: ProductModel) =>
          record.precioCompra
            ? `${util.priceInputFormatter(record.precioCompra)} €`
            : null,
        onCell: (record: ProductModel) => ({
          dataIndex: 'precioCompra',
          type: 'money',
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.precioVenta,
        dataIndex: 'precioVenta',
        sorter: !editingProduct
          ? (a: ProductModel, b: ProductModel) =>
              (a.precioVenta || 0) - (b.precioVenta || 0)
          : false,
        render: (_: any, record: ProductModel) =>
          record.precioVenta
            ? `${util.priceInputFormatter(record.precioVenta)} €`
            : null,
        onCell: (record: ProductModel) => ({
          dataIndex: 'precioVenta',
          type: 'money',
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.notes,
        dataIndex: 'notes',
        onCell: (record: ProductModel) => ({
          dataIndex: 'notes',
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
                disabled={!!editingProduct}
                onClick={() => handleShowProductSale(record)}
              >
                Ver Venta
              </Button>
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
                okText="Sí, eliminar"
                cancelText="No"
                okButtonProps={{ danger: true }}
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
  };

export default ProductTableColumns;
