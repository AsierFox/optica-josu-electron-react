import ProductModel from './product.model';

export default class ProductGenericoModel extends ProductModel {
  description!: string | null;

  constructor(row?: any) {
    super(row);

    if (!row) {
      return;
    }

    this.description = row.DESCRIPTION;
  }
}
