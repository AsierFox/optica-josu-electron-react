export default class ExaminationModel {
  id!: string;

  idClient!: number;
  idExaminationType!: number | null;

  // Ojo Derecho (OD)
  odEsfera!: string | null;
  odCilindro!: string | null;
  odEje!: string | null;
  odADD!: string | null;
  odAV!: string | null;
  odVP!: string | null;
  odVL!: string | null;
  odQueratometria!: string | null;

  // Ojo Izquierdo (OI)
  oiEsfera!: string | null;
  oiCilindro!: string | null;
  oiEje!: string | null;
  oiADD!: string | null;
  oiAV!: string | null;
  oiVP!: string | null;
  oiVL!: string | null;
  oiQueratometria!: string | null;

  dipCerca!: string | null;
  dipLejos!: string | null;

  observaciones!: string | null;

  examinationDate!: string | null;

  createdAt!: string | null;
  updatedAt!: string | null;

  constructor(row?: any) {
    this.id = row.ID;

    this.idClient = row.ID_CLIENT;
    this.idExaminationType = row.ID_EXAMINATION_TYPE;

    // Ojo Derecho
    this.odEsfera = row.OD_ESFERA;
    this.odCilindro = row.OD_CILINDRO;
    this.odEje = row.OD_EJE;
    this.odADD = row.OD_ADD;
    this.odAV = row.OD_AV;
    this.odVP = row.OD_VP;
    this.odVL = row.OD_VL;
    this.odQueratometria = row.OD_QUERATOMETRIA;

    // Ojo Izquierdo
    this.oiEsfera = row.OI_ESFERA;
    this.oiCilindro = row.OI_CILINDRO;
    this.oiEje = row.OI_EJE;
    this.oiADD = row.OI_ADD;
    this.oiAV = row.OI_AV;
    this.oiVP = row.OI_VP;
    this.oiVL = row.OI_VL;
    this.oiQueratometria = row.OI_QUERATOMETRIA;

    this.dipCerca = row.DIP_CERCA;
    this.dipLejos = row.DIP_LEJOS;

    this.observaciones = row.OBSERVACIONES;

    this.examinationDate = row.EXAMINATION_DATE;

    this.createdAt = row.CREATED_AT;
    this.updatedAt = row.UPDATED_AT;
  }
}
