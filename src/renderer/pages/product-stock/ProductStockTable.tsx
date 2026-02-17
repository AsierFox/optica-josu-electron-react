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
import utils from '../../utils/util';
import EditableTableCell from './EditableTableCell';

interface Props {
  loading: boolean;
  dataSource: ProductModel[];
  products: ProductModel[]; // Para los filtros
  editingProduct: ProductModel | null;
  productTypesOptions: { value: number; label: string }[];
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
  productTypesOptions,
  onSave,
  onEdit,
  onCancel,
  onDelete,
}) => {
  const columns = useMemo(() => {
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
          selectOptions: productTypesOptions,
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
    productTypesOptions,
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
