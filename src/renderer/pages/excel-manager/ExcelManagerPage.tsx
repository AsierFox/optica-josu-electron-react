/* eslint-disable no-continue */
import { InboxOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Space,
  Spin,
  Typography,
  Upload,
  notification,
} from 'antd';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import ProductModel from '../../../main/models/product.model';
import ProductTypeModel from '../../../main/models/productType.model';
import AdminLayout from '../../layouts/AdminLayout';
import utils from '../../utils/util';

const { Dragger } = Upload;
const { Title } = Typography;

const ExcelImporter: React.FC = () => {
  const MAX_SEARCH_BLANK_ROWS: number = 100;
  const EXCEL_HEADER_WITH_REQUIRED_VALUE_COLUMNS = [
    'TIPO DE GAFA',
    'REFERENCIA',
  ];
  const EXCEL_HEADER_REQUIRED_COLUMNS = [
    'PROVEEDOR',
    'FIRMAS',
    'TIPO DE GAFA',
    'REFERENCIA',
    'MODELO',
    'COLOR',
    'CALIBRE Y PUENTE',
    'PRECIO DE COMPRA',
    'FECHA DE COMPRA',
    'PRECIO DE VENTA',
    'VENDIDA',
    'FECHA DE VENTA',
  ];

  const [loading, setLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processResultMessages, setProcessResultMessages] = useState<string[]>(
    [],
  );
  const [existingProducts, setExistingProducts] = useState<ProductModel[]>([]);
  const [productTypes, setProductTypes] = useState<ProductTypeModel[]>([]);
  // Ref para almacenar todos los datos sin necesidad de re-renderizar
  const allDataRef = React.useRef<{
    productsToImport: ProductModel[];
    productsToExportExcel: any[];
  }>({
    productsToImport: [],
    productsToExportExcel: [],
  });

  const exportToExcel = (fileName: string = 'Exportacion_Productos.xlsx') => {
    const worksheet = XLSX.utils.json_to_sheet(
      allDataRef.current.productsToExportExcel,
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
    XLSX.writeFile(workbook, fileName);
  };

  const compareProductsFromExcel = () => {
    const newProducts = allDataRef.current.productsToImport.filter(
      (sheetRow) =>
        !existingProducts.some(
          (dbProduct) => dbProduct.referencia === sheetRow.referencia,
        ),
    );
    setProcessResultMessages((prevMessages) => [
      ...prevMessages,
      `Productos nuevos encontrados: ${JSON.stringify(newProducts.map((product) => product.referencia))}`,
    ]);

    const productsWithIncoherentDates: string[] = [];
    allDataRef.current.productsToImport.forEach((importProduct) => {
      existingProducts.forEach((existingProduct) => {
        if (importProduct.referencia === existingProduct.referencia) {
          if (importProduct.fechaCompra !== existingProduct.fechaCompra) {
            productsWithIncoherentDates.push(importProduct.referencia ?? '');
          }
          if (importProduct.fechaVenta !== existingProduct.fechaVenta) {
            productsWithIncoherentDates.push(importProduct.referencia ?? '');
          }
        }
      });
    });
    setProcessResultMessages((prevMessages) => [
      ...prevMessages,
      `Productos con fechas que no coinciden!!: ${productsWithIncoherentDates.join(', ')}`,
    ]);
  };

  const createNewProductsFromExcelSheetRows = (
    sheetName: string,
    sheetRows: any[],
  ): {
    newProductsToImport: ProductModel[];
    newProductsToExportExcel: any[];
  } => {
    const newProductsFromSheet: ProductModel[] = [];
    const rowsToExportSingleExcel: any[] = [];
    // La key es el nombre de cada columna, y el value es el index de la columna
    let sheetHeaderColumnsStructure: { [key: string]: number } = {};

    const sheetRowsLength = sheetRows.length;
    for (let i = 0; i < sheetRowsLength; i += 1) {
      const sheetRow = sheetRows[i];

      // Si la fila es un HEADER, la guardamos y saltamos
      if (sheetRow.isHeaderRow) {
        sheetHeaderColumnsStructure = Object.entries(sheetRow).reduce(
          (acc, [key, value]) => {
            // Descartamos las columnas que son null y el campo isHeaderRow,
            // para quedarnos solo con las que corresponden a las columnas del Excel.
            // eslint-disable-next-line no-restricted-globals
            if (value && !isNaN(Number(key))) {
              acc[(value as string).trim().toUpperCase()] = Number(key);
            }
            return acc;
          },
          {} as any,
        );
        continue;
      }

      // Si no se ha encontrado un HEADER
      if (Object.values(sheetHeaderColumnsStructure).length <= 0) {
        setProcessResultMessages((prevMessages) => [
          ...prevMessages,
          `Pestaña "${sheetName}": No se ha encontrado un ENCABEZADO de COLUMNAS válido!`,
        ]);
        continue;
      }

      // Validamos que TODAS las filas tengan las columnas obligatorias
      const sheetHeaderColumnsStructureList = Object.keys(
        sheetHeaderColumnsStructure,
      );
      const requiredColumnsLeft = EXCEL_HEADER_REQUIRED_COLUMNS.filter(
        (requiredColumn) =>
          !sheetHeaderColumnsStructureList.includes(requiredColumn),
      );
      if (requiredColumnsLeft.length > 0) {
        setProcessResultMessages((prevMessages) => [
          ...prevMessages,
          `Pestaña "${sheetName}": NO cumple con las COLUMNAS obligatorias ${requiredColumnsLeft.join(', ')}!`,
        ]);
      }

      // Comprobamos que TODAS las columnas obligatorias tengan VALOR
      const hasRequiredColumnsValue =
        EXCEL_HEADER_WITH_REQUIRED_VALUE_COLUMNS.every(
          // eslint-disable-next-line no-loop-func
          (requiredColumn) => {
            const requiredColumnSearch = Object.entries(
              sheetHeaderColumnsStructure,
            ).find(([columnName]) => columnName === requiredColumn);

            if (!requiredColumnSearch || requiredColumnSearch.length <= 0) {
              return false;
            }

            const requiredColumnKey = requiredColumnSearch[1] as number;
            const sheetRowColValue = sheetRow[requiredColumnKey];
            return !!sheetRowColValue;
          },
        );

      if (!hasRequiredColumnsValue) {
        setProcessResultMessages((prevMessages) => [
          ...prevMessages,
          `Pestaña "${sheetName}": Alguna FILA NO tiene VALOR las columnas obligatorias!`,
        ]);
      }

      const newProduct: ProductModel = new ProductModel();

      newProduct.proveedor =
        sheetRow[sheetHeaderColumnsStructure.PROVEEDOR] ?? null;
      newProduct.firma = sheetRow[sheetHeaderColumnsStructure.FIRMAS] ?? null;
      newProduct.referencia =
        sheetRow[sheetHeaderColumnsStructure.REFERENCIA] ?? null;
      newProduct.modelo = sheetRow[sheetHeaderColumnsStructure.MODELO] ?? null;
      newProduct.color = sheetRow[sheetHeaderColumnsStructure.COLOR] ?? null;
      switch (sheetRow[sheetHeaderColumnsStructure['TIPO DE GAFA']]) {
        case 'GRADUADA':
        case 'GRADUADO':
          newProduct.typeId = 1;
          break;
        case 'SOL':
          newProduct.typeId = 3;
          break;
        case 'LUPA':
          newProduct.typeId = 4;
          break;
        case 'PRISMATICOS':
          newProduct.typeId = 5;
          break;
        default:
          newProduct.typeId = null;
      }
      newProduct.precioCompra =
        sheetRow[sheetHeaderColumnsStructure['PRECIO DE COMPRA']] ?? null;
      newProduct.precioVenta =
        sheetRow[sheetHeaderColumnsStructure['PRECIO DE VENTA']] ?? null;
      newProduct.calibrePuente =
        sheetRow[sheetHeaderColumnsStructure['CALIBRE Y PUENTE']] ?? null;

      if (sheetRow[sheetHeaderColumnsStructure['FECHA DE COMPRA']]) {
        let fechaCompraValor =
          sheetRow[sheetHeaderColumnsStructure['FECHA DE COMPRA']];

        const regexValidateMMYYYY = /^(0[1-9]|1[0-2])\/\d{4}$/;

        if (regexValidateMMYYYY.test(fechaCompraValor)) {
          fechaCompraValor = `01/${fechaCompraValor}`;
        }
        if (!dayjs(fechaCompraValor).isValid()) {
          setProcessResultMessages((prevMessages) => [
            ...prevMessages,
            `La fecha de Compra de ${newProduct.referencia} no es válida.`,
          ]);
        } else {
          newProduct.fechaCompra =
            utils.formatDateToYYYYMMDD(fechaCompraValor) ?? null;
        }
      }

      if (sheetRow[sheetHeaderColumnsStructure['FECHA DE VENTA']]) {
        let fechaVentaValor =
          sheetRow[sheetHeaderColumnsStructure['FECHA DE VENTA']];

        const regexValidateMMYYYY = /^(0[1-9]|1[0-2])\/\d{4}$/;

        if (regexValidateMMYYYY.test(fechaVentaValor)) {
          fechaVentaValor = `01/${fechaVentaValor}`;
        }
        if (!dayjs(fechaVentaValor).isValid()) {
          setProcessResultMessages((prevMessages) => [
            ...prevMessages,
            `La fecha de Venta de ${newProduct.referencia} no es válida.`,
          ]);
        } else {
          newProduct.fechaVenta =
            utils.formatDateToYYYYMMDD(fechaVentaValor) ?? null;
        }
      }

      newProduct.notes = sheetRow[sheetHeaderColumnsStructure.NOTES] ?? null;

      newProductsFromSheet.push(newProduct);

      rowsToExportSingleExcel.push({
        PROVEEDOR: sheetRow[sheetHeaderColumnsStructure.PROVEEDOR] ?? null,
        FIRMAS: sheetRow[sheetHeaderColumnsStructure.FIRMAS] ?? null,
        'TIPO DE GAFA':
          sheetRow[sheetHeaderColumnsStructure['TIPO DE GAFA']] ?? null,
        REFERENCIA: sheetRow[sheetHeaderColumnsStructure.REFERENCIA] ?? null,
        MODELO: sheetRow[sheetHeaderColumnsStructure.MODELO] ?? null,
        COLOR: sheetRow[sheetHeaderColumnsStructure.COLOR] ?? null,
        'CALIBRE Y PUENTE':
          sheetRow[sheetHeaderColumnsStructure['CALIBRE Y PUENTE']] ?? null,
        'PRECIO DE COMPRA':
          sheetRow[sheetHeaderColumnsStructure['PRECIO DE COMPRA']] ?? null,
        'FECHA DE COMPRA':
          sheetRow[sheetHeaderColumnsStructure['FECHA DE COMPRA']] ?? null,
        'PRECIO DE VENTA':
          sheetRow[sheetHeaderColumnsStructure['PRECIO DE VENTA']] ?? null,
        'FECHA DE VENTA':
          sheetRow[sheetHeaderColumnsStructure['FECHA DE VENTA']] ?? null,
        VENDIDA: sheetRow[sheetHeaderColumnsStructure.VENDIDA] ?? null,
        NOTES: sheetRow[sheetHeaderColumnsStructure.NOTES] ?? null,
      });
    }

    return {
      newProductsToImport: newProductsFromSheet,
      newProductsToExportExcel: rowsToExportSingleExcel,
    };
  };

  const handleReadFile = async (file: File) => {
    setLoading(true);

    const productsFetched = await window.electron.ipcMysql.getProducts();
    setExistingProducts(productsFetched);

    // Timeout para poder mostrar spinner
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const dataArray = new Uint8Array(e.target?.result as ArrayBuffer);
          // Esta línea es la que "congela" todo si el archivo es gigante
          const workbook = XLSX.read(dataArray, {
            cellDates: true,
            type: 'array',
            dense: true,
            cellHTML: false,
            cellText: false,
            cellFormula: false, // Vital para mayor rapidez
          });

          const productsToImport: {
            newProductsToImport: ProductModel[];
            newProductsToExportExcel: any[];
          } = {
            newProductsToImport: [],
            newProductsToExportExcel: [],
          };

          // Recorremos las pestañas del Excel
          workbook.SheetNames.forEach(async (name: string) => {
            const sheet = workbook.Sheets[name];
            // Convertimos a JSON (usamos header: 1 para obtener un array de arrays, que es más rápido)
            const sheetRows: any[][] = XLSX.utils.sheet_to_json(sheet, {
              header: 1,
              defval: null,
            });

            const allSheetProcessedRows: any[] = [];
            let sheetBlankCount = 0;

            // Procesamiento de lectura de las filas del Excel
            const sheetRowsLength = sheetRows.length;
            for (let i = 0; i < sheetRowsLength; i += 1) {
              const sheetRow = sheetRows[i];

              const isRowEmpty = sheetRow.every(
                (cell) => cell === null || cell === '',
              );

              if (isRowEmpty) {
                sheetBlankCount += 1;

                if (sheetBlankCount >= MAX_SEARCH_BLANK_ROWS) {
                  break; // Si encontramos X filas vacías, saltamos a la siguiente pestaña
                }
              } else {
                // Si encontramos una fila con datos, reseteamos el contador
                sheetBlankCount = 0;

                const isHeaderRow = sheetRow.some(
                  (cell) =>
                    typeof cell === 'string' &&
                    EXCEL_HEADER_WITH_REQUIRED_VALUE_COLUMNS.includes(
                      cell.toUpperCase(),
                    ),
                );

                allSheetProcessedRows.push({
                  ...sheetRow,
                  isHeaderRow,
                });
              }
            }

            const productsFromSheet = createNewProductsFromExcelSheetRows(
              name,
              allSheetProcessedRows,
            );
            productsToImport.newProductsToImport.push(
              ...productsFromSheet.newProductsToImport,
            );
            productsToImport.newProductsToExportExcel.push(
              ...productsFromSheet.newProductsToExportExcel,
            );

            // Cada pestaña procesada, liberamos el hilo 1ms
            await new Promise((resolve) => {
              setTimeout(resolve, 0);
            });
          });

          allDataRef.current.productsToImport =
            productsToImport.newProductsToImport;
          allDataRef.current.productsToExportExcel =
            productsToImport.newProductsToExportExcel;

          setProcessResultMessages((prevMessages) => [
            ...prevMessages,
            `Total: ${allDataRef.current.productsToImport.length} productos en ${workbook.SheetNames.length} pestañas.`,
          ]);
        } catch {
          setErrorMessage('Error al procesar el Excel');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }, 100); // 100ms son suficientes para pintar el spinner antes de procesar el archivo

    return false;
  };

  const handleSaveToDDBB = async () => {
    setLoading(true);
    try {
      await window.electron.ipcMysql.createProducts(
        allDataRef.current.productsToImport,
      );
      api.success({
        message: 'Importación completada',
        description: 'Los datos se han guardado en la base de datos.',
      });
    } catch {
      api.error({ message: 'Error al guardar los datos' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelImport = () => {
    allDataRef.current.productsToImport = [];
    allDataRef.current.productsToExportExcel = [];
    setProcessResultMessages([]);
    setErrorMessage(null);
  };

  useEffect(() => {
    const getProductTypes = async () => {
      try {
        const productTypesDDBB =
          await window.electron.ipcMysql.getProductTypes();
        setProductTypes(productTypesDDBB);
      } catch {
        setErrorMessage('Error al cargar los tipos de producto');
      } finally {
        setLoading(false);
      }
    };

    getProductTypes();
  }, []);

  return (
    <AdminLayout>
      {errorMessage ? (
        <Alert
          message="Error"
          showIcon
          type="error"
          style={{ marginBottom: 16 }}
          description={errorMessage}
        />
      ) : null}

      <Spin
        spinning={loading}
        size="large"
        tip={
          <div
            style={{ marginTop: '10px', fontSize: '30px', fontWeight: 'bold' }}
          >
            Procesando, puede tardar unos minutos...
          </div>
        }
      >
        <Card>
          {contextHolder}
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={3}>Importar Productos desde Excel</Title>
            </div>

            {processResultMessages.length <= 0 ? (
              <Dragger
                accept=".xlsx, .xls, .csv"
                beforeUpload={handleReadFile}
                showUploadList={false}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: '#13c2c2' }} />
                </p>
                <p className="ant-upload-text">
                  Haz clic o arrastra el archivo Excel aquí
                </p>
                <p className="ant-upload-hint">
                  Soporta archivos individuales .xlsx y .csv
                </p>
              </Dragger>
            ) : (
              <div style={{ marginTop: '20px' }}>
                <Alert
                  style={{
                    marginTop: '16px',
                    padding: '24px',
                    borderRadius: '8px',
                    borderWidth: '2px',
                  }}
                  message={processResultMessages.map((processResultMessage) => {
                    return (
                      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        {processResultMessage}
                      </div>
                    );
                  })}
                  description={
                    <Space>
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: '#3fc213',
                          borderColor: '#3fc213',
                          fontSize: '16px',
                        }}
                        onClick={handleSaveToDDBB}
                      >
                        Importar Productos a la Base de Datos
                      </Button>
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: '#43bb7d',
                          borderColor: '#43bb7d',
                          fontSize: '16px',
                        }}
                        onClick={() => compareProductsFromExcel()}
                      >
                        Comparar datos con BBDD
                      </Button>
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: '#13c268',
                          borderColor: '#13c268',
                          fontSize: '16px',
                        }}
                        onClick={() => exportToExcel()}
                      >
                        Exportar a Única Excel
                      </Button>
                      <Button type="default" onClick={handleCancelImport}>
                        Volver a Cargar
                      </Button>
                    </Space>
                  }
                  type="success"
                  showIcon
                />
              </div>
            )}
          </Space>
        </Card>
      </Spin>
    </AdminLayout>
  );
};

export default ExcelImporter;
