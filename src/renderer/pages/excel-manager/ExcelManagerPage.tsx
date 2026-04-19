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
import ProductModel from '../../../main/models/product.model';
import ProductTypeModel from '../../../main/models/productType.model';
import AdminLayout from '../../layouts/AdminLayout';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processResultMessages, setProcessResultMessages] = useState<string[]>(
    [],
  );
  const [productTypes, setProductTypes] = useState<ProductTypeModel[]>([]);
  // Ref para almacenar todos los datos sin necesidad de re-renderizar
  const allDataRef = React.useRef<ProductModel[]>([]);
  const [api, contextHolder] = notification.useNotification();

  const createNewProductsFromExcelSheetRows = (
    sheetName: string,
    sheetRows: any[],
  ): ProductModel[] => {
    const newProductsFromSheet: ProductModel[] = [];
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
      newProduct.firma = sheetRow[sheetHeaderColumnsStructure.FIRMA] ?? null;
      newProduct.referencia =
        sheetRow[sheetHeaderColumnsStructure.FIRMAS] ?? null;
      newProduct.modelo = sheetRow[sheetHeaderColumnsStructure.MODELO] ?? null;
      newProduct.color = sheetRow[sheetHeaderColumnsStructure.COLOR] ?? null;
      newProduct.typeId = null;
      newProduct.precioCompra =
        sheetRow[sheetHeaderColumnsStructure['PRECIO DE COMPRA']] ?? null;
      newProduct.precioVenta =
        sheetRow[sheetHeaderColumnsStructure['PRECIO DE VENTA']] ?? null;
      newProduct.calibrePuente =
        sheetRow[sheetHeaderColumnsStructure['CALIBRE Y PUENTE']] ?? null;
      // TODO Revisar FECHAS
      newProduct.fechaCompra =
        sheetRow[sheetHeaderColumnsStructure['FECHA DE COMPRA']] ?? null;
      // TODO Hacer juego con Columna VENDIDA
      newProduct.fechaVenta =
        sheetRow[sheetHeaderColumnsStructure['FECHA DE VENTA']] ?? null;

      newProductsFromSheet.push(newProduct);
    }

    return newProductsFromSheet;
  };

  const handleReadFile = (file: File) => {
    setLoading(true);

    // Timeout para poder mostrar spinner
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const dataArray = new Uint8Array(e.target?.result as ArrayBuffer);
          // Esta línea es la que "congela" todo si el archivo es gigante
          const workbook = XLSX.read(dataArray, {
            type: 'array',
            dense: true,
            cellHTML: false,
            cellText: false,
            cellFormula: false, // Vital para mayor rapidez
          });

          const productsToImport: ProductModel[] = [];

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

            productsToImport.push(
              ...createNewProductsFromExcelSheetRows(
                name,
                allSheetProcessedRows,
              ),
            );

            // Cada pestaña procesada, liberamos el hilo 1ms
            await new Promise((resolve) => {
              setTimeout(resolve, 0);
            });
          });

          allDataRef.current = productsToImport;

          setProcessResultMessages((prevMessages) => [
            ...prevMessages,
            `Total: ${allDataRef.current.length} productos en ${workbook.SheetNames.length} pestañas.`,
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
      console.log(allDataRef.current);
      // await window.electron.ipcMysql.importClients(data);

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
    allDataRef.current = [];
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
                          backgroundColor: '#13c268',
                          borderColor: '#13c268',
                          fontSize: '16px',
                        }}
                        onClick={handleSaveToDDBB}
                      >
                        Importar Productos a la Base de Datos
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
