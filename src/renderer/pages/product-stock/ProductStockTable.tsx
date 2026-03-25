import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Space, Table } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import ProductModel from '../../../main/models/product.model';
import ProductTypeModel from '../../../main/models/productType.model';
import { PRODUCT_FIELD_NAMES } from '../../app/constants';
import utils from '../../utils/util';
import EditableTableCell from './EditableTableCell';

interface Props {
  loading: boolean;
  dataSource: ProductModel[];
  products: ProductModel[]; // Para los filtros
  editingProduct: ProductModel | null;
  productTypes: ProductTypeModel[];
  onSave: () => void;
  onEdit: (record: ProductModel) => void;
  onCancel: () => void;
  onDelete: (record: ProductModel) => void;
}

const ProductStockTable: React.FC<Props> = ({
  loading,
  dataSource,
  products,
  editingProduct,
  productTypes,
  onSave,
  onEdit,
  onCancel,
  onDelete,
}) => {
  const columns: any = useMemo(() => {
    const proveedorFilters = utils
      .uniq(
        products.map((product: ProductModel) =>
          product.proveedor.toUpperCase(),
        ),
      )
      .map((filter: string) => ({ text: filter, value: filter }));

    const firmaFilters = utils
      .uniq(
        products.map((product: ProductModel) => product.firma.toUpperCase()),
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

    return [
      {
        title: PRODUCT_FIELD_NAMES.id,
        dataIndex: 'id',
      },
      {
        title: PRODUCT_FIELD_NAMES.proveedor,
        dataIndex: 'proveedor',
        filters: proveedorFilters,
        filterSearch: true,
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
        title: PRODUCT_FIELD_NAMES.firma,
        dataIndex: 'firma',
        filters: firmaFilters,
        filterSearch: true,
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
        title: PRODUCT_FIELD_NAMES.type,
        dataIndex: 'type',
        filters: productTypeFilters,
        filterSearch: true,
        onFilter: (value: string, record: ProductModel) =>
          utils.equalsStrings(record.type, value),
        sorter: (a: ProductModel, b: ProductModel) =>
          a.type.localeCompare(b.type),
        onCell: (record: ProductModel) => ({
          dataIndex: 'typeId',
          required: true,
          type: 'select',
          record,
          editingProduct,
          selectOptions: productTypesSelectOptions,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.referencia,
        dataIndex: 'referencia',
        sorter: (a: ProductModel, b: ProductModel) =>
          a.referencia.localeCompare(b.referencia),
        onCell: (record: ProductModel) => ({
          dataIndex: 'referencia',
          required: true,
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.modeloColor,
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
        title: PRODUCT_FIELD_NAMES.calibrePuente,
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
        title: PRODUCT_FIELD_NAMES.fechaCompra,
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
        title: PRODUCT_FIELD_NAMES.precioCompra,
        dataIndex: 'precioCompra',
        render: (_: any, record: ProductModel) =>
          record.precioCompra
            ? `${utils.priceInputFormatter(record.precioCompra)} €`
            : null,
        onCell: (record: ProductModel) => ({
          dataIndex: 'precioCompra',
          type: 'money',
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.fechaVenta,
        dataIndex: 'fechaVenta',
        onCell: (record: ProductModel) => ({
          dataIndex: 'fechaVenta',
          type: 'date',
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.precioVenta,
        dataIndex: 'precioVenta',
        render: (_: any, record: ProductModel) =>
          record.precioVenta
            ? `${utils.priceInputFormatter(record.precioVenta)} €`
            : null,
        onCell: (record: ProductModel) => ({
          dataIndex: 'precioVenta',
          type: 'money',
          record,
          editingProduct,
        }),
      },
      {
        title: PRODUCT_FIELD_NAMES.cantidad,
        dataIndex: 'cantidad',
        onCell: (record: ProductModel) => ({
          dataIndex: 'cantidad',
          required: true,
          type: 'number',
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
                onClick={onSave}
              >
                Guardar
              </Button>
              <Popconfirm
                title="¿Desea cancelar la edición del producto?"
                onConfirm={() => onCancel()}
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
                onClick={() => onEdit(record)}
              >
                Editar
              </Button>
              <Popconfirm
                title="¿Desea borrar producto?"
                onConfirm={() => onDelete(record)}
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
  }, [
    editingProduct,
    products,
    productTypes,
    onSave,
    onEdit,
    onCancel,
    onDelete,
  ]);

  return (
    <Table
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      scroll={{ x: 'max-content' }}
      components={{
        body: {
          // Componente de celda que usa Form.Item
          cell: EditableTableCell,
        },
      }}
      pagination={{
        defaultPageSize: 50,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100', '500'],
        position: ['bottomCenter'],
        showTotal: (total, range) =>
          `Mostrando ${range[1] - range[0] + 1} de un total de ${total} productos`,
      }}
    />
  );
};

export default React.memo(ProductStockTable);
