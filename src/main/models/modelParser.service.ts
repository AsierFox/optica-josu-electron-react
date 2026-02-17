import ProductModel from '../models/product.model';
import ProductTypeModel from '../models/productType.model';

export default class ModelParserService {

  static parseProductModels(rows: any[]): ProductModel[] {
    return rows.map(row => new ProductModel(row));
  }

  static parseProductTypes(rows: any[]): ProductTypeModel[] {
    return rows.map(row => new ProductTypeModel(row));
  }
}
