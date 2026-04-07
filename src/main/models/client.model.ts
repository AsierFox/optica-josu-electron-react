export default class ClientModel {
  id!: string;
  nombre!: string | null;
  apellidos!: string | null;
  direccion!: string;
  ciudad!: string | null;
  codigoPostal!: number | null;
  telefono!: string | null;
  DNI!: string | null;
  fechaNacimiento!: number | null;
  notes!: number | null;
  createdAt!: string | null;
  updatedAt!: string | null;

  constructor(row?: any) {
    this.id = row.ID;

    this.nombre = row.NOMBRE;
    this.apellidos = row.APELLIDOS;
    this.direccion = row.DIRECCION;
    this.ciudad = row.CIUDAD;
    this.codigoPostal = row.CODIGO_POSTAL;
    this.telefono = row.TELEFONO;
    this.DNI = row.DNI;
    this.fechaNacimiento = row.FECHA_NACIMIENTO;
    this.notes = row.NOTES;

    this.createdAt = row.CREATED_AT;
    this.updatedAt = row.UPDATED_AT;
  }

}
