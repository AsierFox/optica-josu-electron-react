import ProductModel from './product.model';

export default class ProductLenteLentillaModel extends ProductModel {
  numeroPedido!: string | null;
  odGraduacion!: string | null;
  oiGraduacion!: string;
  odAdicion!: string | null;
  oiAdicion!: string | null;
  odPrisma!: string | null;
  oiPrisma!: string | null;

  constructor(row?: any) {
    super(row);

    if (!row) {
      return;
    }

    this.numeroPedido = row.NUMERO_PEDIDO;
    this.odGraduacion = row.OD_GRADUACION;
    this.oiGraduacion = row.OI_GRADUACION;
    this.odAdicion = row.OD_ADICION;
    this.oiAdicion = row.OI_ADICION;
    this.odPrisma = row.OD_PRISMA;
    this.odPrisma = row.OI_PRISMA;
  }
}
