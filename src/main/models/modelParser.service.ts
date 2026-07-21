import ProductTypeModel from '../models/productType.model';
import ProductRepository from '../repositories/product.repository';
import CustomerModel from './customer.model';
import ExaminationModel from './examination.model';
import ExaminationTypeModel from './examinationType.model';
import OrderByPeriodModel from './orderByPeriod.model';
import ProductModel from './product.model';
import ProductGenericoModel from './productGenerico.model';
import ProductLenteLentillaModel from './productLenteLentilla.model';
import ProductMonturaModel from './productMontura.model';

export default class ModelParserService {

  static parseCustomerModels(rows: any[]): CustomerModel[] {
    return rows.map(row => new CustomerModel(row));
  }

  static parseExaminationModels(rows: any[]): ExaminationModel[] {
    return rows.map(row => new ExaminationModel(row));
  }

  static parseProductsModels(rows: any[]): ProductModel[] {
    return rows.map(row => {
      if (ProductRepository.SPECIFIC_PRODUCT_TYPE_IDS.MONTURA.includes(row.PRODUCT_TYPE_ID)) {
        return new ProductMonturaModel(row);
      }
      if (ProductRepository.SPECIFIC_PRODUCT_TYPE_IDS.LENTE_LENTILLAS.includes(row.PRODUCT_TYPE_ID)) {
        return new ProductLenteLentillaModel(row);
      }
      return new ProductGenericoModel(row);
    });
  }

  static parseProductTypes(rows: any[]): ProductTypeModel[] {
    return rows.map(row => new ProductTypeModel(row));
  }

  static parseExaminationTypes(rows: any[]): ExaminationTypeModel[] {
    return rows.map(row => new ExaminationTypeModel(row));
  }

  static parseOrderByPeriodModel(rows: any[]): OrderByPeriodModel[] {
    return rows.map(row => new OrderByPeriodModel(row));
  }

}
