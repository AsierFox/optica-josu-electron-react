import util from '../../renderer/utils/util';

export default class ProductModel {
  id: string;
  proveedor: string;
  firma: string;
  referencia: string;
  modeloColor: string;
  typeId: number;
  type: string;
  calibrePuente: string;
  precioCompra: number | null;
  precioVenta: number | null;
  cantidad: number;
  fechaCompra: string | null;
  fechaVenta: string | null;
  createdAt: string | null;
  updatedAt: string | null;

  constructor(row: any) {
    this.id = row.ID;
    this.proveedor = row.PROVEEDOR;
    this.firma = row.FIRMA;
    this.referencia = row.REFERENCIA;
    this.modeloColor = row.MODELO_COLOR;
    this.typeId = row.ID_PRODUCT_TYPE;
    this.type = row.TYPE;
    this.precioCompra = row.PRECIO_COMPRA;
    this.precioVenta = row.PRECIO_VENTA;
    this.calibrePuente = row.CALIBRE_PUENTE;
    this.cantidad = row.CANTIDAD;

    this.fechaCompra = util.formatDateToYYYYMMDD(row.FECHA_COMPRA);
    this.fechaVenta = util.formatDateToYYYYMMDD(row.FECHA_VENTA);

    this.createdAt = row.CREATED_AT;
    this.updatedAt = row.UDPATED_AT;
  }
}
