import BaseModel from './base.model';
import OrderItemModel from './orderItem.model';

export default class OrderModel extends BaseModel {
  id!: string;
  statusId!: string | null;
  status!: string | null;
  customerId!: number | null;
  fechaVenta!: number | null;
  createdAt!: string | null;
  updatedAt!: string | null;

  orderItems!: OrderItemModel[] | [];

  constructor(row?: any, orderItems?: OrderItemModel[]) {
    super();

    this.id = row.ID;

    this.statusId = row.ORDER_STATUS_ID;
    this.status = row.ORDER_STATUS;
    this.customerId = row.CUSTOMER_ID;
    this.fechaVenta = row.FECHA_VENTA;
    this.createdAt = row.CREATED_AT;
    this.updatedAt = row.UPDATED_AT;

    this.orderItems = orderItems ?? [];
  }

}
