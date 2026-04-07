export const APP_NAME = 'Josu Optica Electron';
export const APP_VERSION = '1.0.0';

export const DATE_FORMATS = {
  YYYY_MM_DD: 'YYYY-MM-DD',
};

export const ROUTES = {
  HOME: '/',
  PRODUCT_STOCK: '/product-stock',
  PRESUPUESTO_GENERATOR: '/presupuesto-generator',
  CLIENT_MANAGER: '/client-manager',
  CLIENT_MANAGER_FORM: '/client-manager/:client_id?',
};

export const NEW_PRODUCT_ID_PREFIX = 'temp_';

export const CLIENT_FIELD_NAMES = {
  id: 'ID',
  nombre: 'Nombre',
  apellidos: 'Apellidos',
  direccion: 'Dirección',
  ciudad: 'Ciudad',
  codigoPostal: 'Código Postal',
  telefono: 'Teléfono',
  DNI: 'DNI',
  fechaNacimiento: 'Fecha de Nacimiento',
  notes: 'Observaciones',
}

export const PRODUCT_FIELD_NAMES = {
  id: 'ID',
  proveedor: 'Proveedor',
  firma: 'Firma',
  referencia: 'Referencia',
  modeloColor: 'Modelo y Color',
  type: 'Tipo de Producto',
  calibrePuente: 'Calibre y Puente',
  precioCompra: 'Precio de Compra',
  precioVenta: 'Precio de Venta',
  cantidad: 'Cantidad',
  fechaCompra: 'Fecha de Compra',
  fechaVenta: 'Fecha de Venta',
  notes: 'Observaciones',
}
