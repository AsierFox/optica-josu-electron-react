import ProductModel from '../models/product.model';
import ProductTypeModel from '../models/productType.model';
import ClientModel from './client.model';
import ExaminationModel from './examination.model';
import ExaminationTypeModel from './examinationType.model';
import SaleModel from './sale.model';
import SaleByPeriodModel from './saleByPeriod.model';

export default class ModelParserService {

  static parseClientModels(rows: any[]): ClientModel[] {
    return rows.map(row => new ClientModel(row));
  }

  static parseExaminationModels(rows: any[]): ExaminationModel[] {
    return rows.map(row => new ExaminationModel(row));
  }

  static parseProductModels(rows: any[]): ProductModel[] {
    return rows.map(row => {
      const sale = new SaleModel({
        FECHA_VENTA: row.FECHA_VENTA,
        PRODUCTO_ID: row.ID,
        CLIENTE_ID: row.CLIENTE_ID
      });
      return new ProductModel({
        ...row,
        sale
      });
    });
  }

  static parseProductTypes(rows: any[]): ProductTypeModel[] {
    return rows.map(row => new ProductTypeModel(row));
  }

  static parseExaminationTypes(rows: any[]): ExaminationTypeModel[] {
    return rows.map(row => new ExaminationTypeModel(row));
  }

  static parseSaleModels(rows: any[]): SaleModel[] {
    return rows.map(row => {
      const product = new ProductModel({
        PROVEEDOR: row.PROVEEDOR,
        FIRMA: row.FIRMA,
        REFERENCIA: row.REFERENCIA,
        MODELO: row.MODELO,
        PRECIO_VENTA: row.PRECIO_VENTA,
        PRECIO_COMPRA: row.PRECIO_COMPRA,
        NOTES: row.NOTES
      });
      return new SaleModel({
        ...row,
        product
      });
    });
  }

  static parseSaleByPeriodModel(rows: any[]): SaleByPeriodModel[] {
    return rows.map(row => new SaleByPeriodModel(row));
  }

}
