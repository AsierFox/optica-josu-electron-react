import ProductModel from '../models/product.model';
import ProductTypeModel from '../models/productType.model';
import ClientModel from './client.model';
import ExaminationModel from './examination.model';
import ExaminationTypeModel from './examinationType.model';
import SaleModel from './sale.model';

export default class ModelParserService {

  static parseClientModels(rows: any[]): ClientModel[] {
    return rows.map(row => new ClientModel(row));
  }

  static parseExaminationModels(rows: any[]): ExaminationModel[] {
    return rows.map(row => new ExaminationModel(row));
  }

  static parseProductModels(rows: any[]): ProductModel[] {
    return rows.map(row => new ProductModel(row));
  }

  static parseProductTypes(rows: any[]): ProductTypeModel[] {
    return rows.map(row => new ProductTypeModel(row));
  }

  static parseExaminationTypes(rows: any[]): ExaminationTypeModel[] {
    return rows.map(row => new ExaminationTypeModel(row));
  }

  static parseSaleModels(rows: any[]): SaleModel[] {
    return rows.map(row => {
      const product = new ProductModel(row);
      return new SaleModel({
        ...row,
        product
      });
    });
  }

}
