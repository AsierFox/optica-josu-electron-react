import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import SaleModel from '../../../main/models/order.model';
import utils from '../../utils/util';

interface Props {
  purchases: SaleModel[];
  onEdit: (record: SaleModel) => void;
  onDelete: (record: SaleModel) => void;
}

const OrderHistoryTable: React.FC<Props> = ({
  purchases,
  onEdit,
  onDelete,
}) => {
  const columns: TableColumnsType<SaleModel> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Fecha de Venta',
      dataIndex: 'fechaVenta',
      key: 'fechaVenta',
      sorter: (a: SaleModel, b: SaleModel) =>
        dayjs(a.fechaVenta).unix() - dayjs(b.fechaVenta).unix(),
      render: (value: string) =>
        // @ts-ignore
        value ? utils.formatDateToYYYYMMDD(value) : null,
    },
    {
      title: 'Precio Venta',
      dataIndex: ['product', 'precioVenta'],
      key: 'precioVenta',
      sorter: (a: SaleModel, b: SaleModel) =>
        (a.product?.precioVenta || 0) - (b.product?.precioVenta || 0),
      render: (_: any, record: SaleModel) =>
        record.product?.precioVenta
          ? `${utils.priceInputFormatter(record.product.precioVenta)} €`
          : null,
    },
    {
      title: 'Referencia',
      dataIndex: ['product', 'referencia'],
      key: 'referencia',
    },
    {
      title: 'Modelo',
      dataIndex: ['product', 'modelo'],
      key: 'modelo',
    },
    {
      title: 'Precio de Compra',
      dataIndex: ['product', 'precioCompra'],
      key: 'precioCompra',
      sorter: (a: SaleModel, b: SaleModel) =>
        (a.product?.precioCompra || 0) - (b.product?.precioCompra || 0),
      render: (_: any, record: SaleModel) =>
        record.product?.precioCompra
          ? `${utils.priceInputFormatter(record.product.precioCompra)} €`
          : null,
    },
    {
      title: 'Proveedor',
      dataIndex: ['product', 'proveedor'],
      key: 'proveedor',
    },
    {
      title: 'Firma',
      dataIndex: ['product', 'firma'],
      key: 'firma',
    },
    {
      title: 'Notas',
      dataIndex: ['product', 'notes'],
      key: 'notes',
    },
    {
      title: 'Operaciones',
      fixed: 'right',
      render: (_: any, record: SaleModel) => (
        <Space>
          <Button
            size="small"
            color="cyan"
            variant="dashed"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Desea eliminar la venta?"
            okText="Sí, eliminar"
            cancelText="No"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record)}
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const data: SaleModel[] = purchases;

  return (
    <Table<SaleModel>
      rowKey="id"
      bordered
      sticky
      scroll={{ x: 'max-content' }}
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 25 }}
    />
  );
};

export default OrderHistoryTable;
