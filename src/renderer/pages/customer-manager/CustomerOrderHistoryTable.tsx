import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import OrderModel from '../../../main/models/order.model';
import utils from '../../utils/util';

interface Props {
  orders: OrderModel[];
  onEdit: (record: OrderModel) => void;
  onDelete: (record: OrderModel) => void;
}

const CustomerOrderHistoryTable: React.FC<Props> = ({
  orders,
  onEdit,
  onDelete,
}) => {
  const columns: TableColumnsType<OrderModel> = [
    { title: 'ID Pedido', dataIndex: 'id', key: 'id' },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Tipo de Producto',
      key: 'type',
      render: (_, record) => record.orderItems?.[0]?.product?.type,
    },
    {
      title: 'Fecha de Venta',
      dataIndex: 'fechaVenta',
      key: 'fechaVenta',
      sorter: (a: OrderModel, b: OrderModel) =>
        dayjs(a.fechaVenta).unix() - dayjs(b.fechaVenta).unix(),
      render: (value: string) =>
        // @ts-ignore
        value ? utils.formatDateToYYYYMMDD(value) : null,
    },
    {
      title: 'Precio Venta',
      key: 'precioVenta',
      sorter: (a: OrderModel, b: OrderModel) =>
        (a.product?.precioVenta ?? 0) - (b.product?.precioVenta ?? 0),
      render: (_, record) => record.orderItems?.[0]?.product?.precioVenta,
    },
    {
      title: 'Operaciones',
      fixed: 'right',
      render: (_: any, record: OrderModel) => (
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

  const data: OrderModel[] = orders;

  return (
    <Table<OrderModel>
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

export default CustomerOrderHistoryTable;
