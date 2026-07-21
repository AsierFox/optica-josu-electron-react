export const APP_NAME = 'Josu Optica Electron';

export const DATE_FORMATS = {
  YYYY_MM_DD: 'YYYY-MM-DD',
};

export enum PRODUCT_STOCK_TYPE {
  GENERICO = 1,
  MONTURA = 2,
  LENTE_LENTILLA = 3,
};

export const ROUTES = {
  HOME: '/',
  STOCK_MONTURAS: '/stock-monturas',
  STOCK_LENTES_LENTILLAS: '/stock-lentes-lentillas',
  STOCK_GENERICO: '/stock-generico',
  PRESUPUESTO_GENERATOR: '/presupuesto-generator',
  CUSTOMERS_MANAGER: '/customer-manager',
  CUSTOMERS_MANAGER_FORM: '/customer-manager/:customer_id?',
  STATISTICS: '/statistics',
};

export const NEW_ROW_ID_PREFIX = 'temp_';

export const CUSTOMERS_FIELD_NAMES = {
  id: 'ID',
  nombre: 'Nombre',
  apellidos: 'Apellidos',
  direccion: 'Dirección',
  ciudad: 'Ciudad',
  codigoPostal: 'Código Postal',
  telefono: 'Teléfono',
  telefonoAdicional: 'Teléfono Adicional',
  DNI: 'DNI',
  fechaNacimiento: 'Fecha de Nacimiento',
  notes: 'Observaciones',
};

export const PRODUCT_FIELD_NAMES = {
  id: 'ID',
  proveedor: 'Proveedor',
  firma: 'Firma',
  referencia: 'Referencia',
  modelo: 'Modelo',
  color: 'Color',
  type: 'Tipo de Producto',
  calibrePuente: 'Calibre y Puente',
  numeroPedido: 'Número de Pedido',
  odGraduacion: 'Graduación Ojo Derecho',
  oiGraduacion: 'Graduación Ojo Izquierdo',
  odAdicion: 'Adición Ojo Derecho',
  oiAdicion: 'Adición Ojo Izquierdo',
  odPrisma: 'Ojo Derecho Prisma',
  oiPrisma: 'Ojo Izquierdo Prisma',
  description: 'Descripción',
  precioCompra: 'Precio de Compra',
  precioVenta: 'Precio de Venta',
  fechaCompra: 'Fecha de Compra',
  fechaVenta: 'Fecha de Venta',
  notes: 'Observaciones',
};
