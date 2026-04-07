import ProductModel from '../models/product.model';
import ProductTypeModel from '../models/productType.model';
import ClientModel from './client.model';

export default class ModelParserService {

  static parseClientModels(rows: any[]): ClientModel[] {
    return rows.map(row => new ClientModel(row));
  }

  static parseProductModels(rows: any[]): ProductModel[] {
    return rows.map(row => new ProductModel(row));
  }

  static parseProductTypes(rows: any[]): ProductTypeModel[] {
    return rows.map(row => new ProductTypeModel(row));
  }
}
