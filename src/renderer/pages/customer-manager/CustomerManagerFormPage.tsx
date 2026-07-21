import {
  ArrowLeftOutlined,
  EyeOutlined,
  HistoryOutlined,
  HomeOutlined,
  IdcardOutlined,
  PhoneOutlined,
  PlusOutlined,
  SaveOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Spin,
  Tabs,
} from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerModel from '../../../main/models/customer.model';
import ExaminationModel from '../../../main/models/examination.model';
import ExaminationTypeModel from '../../../main/models/examinationType.model';
import ProductModel from '../../../main/models/product.model';
import SaleModel from '../../../main/models/order.model';
import { NEW_ROW_ID_PREFIX, ROUTES } from '../../app/constants';
import AdminLayout from '../../layouts/AdminLayout';
import utils from '../../utils/util';
import ExaminationForm from './ExaminationForm';
import OrderHistoryTable from './OrderHistoryTable';

const CustomerManagerFormPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [api, contextHolder] = notification.useNotification();

  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(false);
  const [customer, setCustomer] = useState<CustomerModel | null>(null);

  const [examinations, setExaminations] = useState<ExaminationModel[]>([]);
  const [examinationTypes, setExaminationTypes] = useState<
    ExaminationTypeModel[]
  >([]);
  const [allProductsForSale, setAllProductsForSale] = useState<ProductModel[]>(
    [],
  );
  const [purchases, setPurchases] = useState<SaleModel[]>([]);

  const { customer_id: customerIdParam } = useParams<{ customer_id: string }>();

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] =
    useState<boolean>(false);
  const [editingSale, setEditingSale] = useState<SaleModel | null>(null);

  const navigate = useNavigate();
  const [customerForm] = Form.useForm();
  const [purchaseForm] = Form.useForm();

  const getExaminationTypesAndProductsForSale = useCallback(
    async (productId?: number) => {
      try {
        const examinationTypesDDBB =
          await window.electron.ipcMysql.getExaminationTypes();
        const allProductsForSaleDDBB =
          await window.electron.ipcMysql.getAllProductsForSale(productId);

        setExaminationTypes(examinationTypesDDBB);
        setAllProductsForSale(allProductsForSaleDDBB);
      } catch (error: any) {
        api.error({
          message: 'Error',
          description: '¡No se pudo obtener los productos en venta!',
        });
        setErrorMessage(
          `No se pudo obtener los productos en venta! ${error?.message || error}`,
        );
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  const openSaleModalOpen = async (sale?: SaleModel) => {
    setEditingSale(sale ?? null);

    try {
      // Actualizamos la lista de tipos y los productos en venta.
      // Porque se puede crear una venta y ese producto ya no está disponible,
      // o borrar una venta y ese producto ya vuelve a estar disponible.
      await getExaminationTypesAndProductsForSale(Number(sale?.productId));

      purchaseForm.resetFields();

      if (sale) {
        purchaseForm.setFieldsValue({
          fechaVenta: sale.fechaVenta ? dayjs(sale.fechaVenta) : dayjs(),
          // Preseleccionamos el producto, en caso de edición
          productId: sale.productId,
        });
      }

      setIsPurchaseModalOpen(true);
    } catch (error: any) {
      api.error({
        message: 'Error',
        description: '¡No se pudo eliminar la venta!',
      });
      setErrorMessage(
        `¡No se pudo eliminar la venta! ${error?.message || error}`,
      );
    }
  };

  const handleCustomerSubmit = async (values: any) => {
    setLoading(true);

    try {
      const updatedCustomer: CustomerModel = {
        ...customer,
        ...values,
        fechaNacimiento: values.fechaNacimiento?.format('YYYY-MM-DD'),
      } as CustomerModel;

      if (isNewCustomer) {
        const newCustomerId =
          await window.electron.ipcMysql.createCustomer(updatedCustomer);

        updatedCustomer.id = newCustomerId.toString();
        // Ahora que el cliente tiene un ID, dejamos de considerarlo "nuevo".
        setIsNewCustomer(false);
      } else {
        await window.electron.ipcMysql.updateCustomer(updatedCustomer);
      }

      setCustomer(updatedCustomer);

      api.success({
        message: 'Éxito',
        description: `¡Cliente ${isNewCustomer ? 'creado' : 'actualizado'} correctamente!`,
      });
    } catch (error: any) {
      api.error({
        message: 'Error',
        description: '¡No se pudo guardar el cliente!',
      });
      setErrorMessage(
        `¡No se pudo guardar el cliente! ${error?.message || error}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExaminationForm = async (examination: ExaminationModel) => {
    setLoading(true);
    try {
      const isNewExamination = examination.id
        .toString()
        .startsWith(NEW_ROW_ID_PREFIX);
      // Guardamos el ID antiguo para poder buscarlo y encontrarlo en el map
      const oldId = examination.id;

      let examinationToSave = examination;

      if (isNewExamination) {
        const newExaminationId =
          await window.electron.ipcMysql.createExamination(examination);

        examinationToSave = {
          ...examination,
          // Guardamos el nuevo ID de la BBDD
          id: newExaminationId.toString(),
        };
      } else {
        await window.electron.ipcMysql.updateExamination(examination);
      }

      setExaminations((prevExaminations) =>
        prevExaminations.map((prevExamination) =>
          prevExamination.id === oldId ? examinationToSave : prevExamination,
        ),
      );

      api.success({
        message: isNewExamination
          ? 'Graduación guardada exitosamente'
          : 'Graduación actualizada exitosamente',
        description: isNewExamination
          ? 'La nueva graduación ha sido guardada correctamente.'
          : 'La graduación ha sido actualizada correctamente.',
      });
    } catch {
      api.error({
        message: 'Error al guardar la graduación',
        description:
          'Ocurrió un error al intentar guardar la graduación. Por favor, intenta nuevamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExaminationForm = async (examinationId: string) => {
    // 1.- Si no está en BBDD, simplemente la eliminamos del estado local
    if (examinationId.toString().startsWith(NEW_ROW_ID_PREFIX)) {
      setExaminations((prevExaminations) =>
        prevExaminations.filter(
          (examination) => examination.id !== examinationId,
        ),
      );
      return;
    }

    // 2.- Si la graduación está en BBDD, la eliminamos
    try {
      setLoading(true);
      await window.electron.ipcMysql.deleteExamination(Number(examinationId));

      setExaminations((prevExaminations) =>
        prevExaminations.filter(
          (examination) => examination.id !== examinationId,
        ),
      );

      api.success({
        message: '¡Graduación Eliminada!',
      });
    } catch {
      api.error({
        message: 'Error al eliminar la graduación',
        description:
          'Ocurrió un error al intentar eliminar la graduación. Por favor, intenta nuevamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewExaminationForm = () => {
    if (!customer) {
      api.error({
        message: 'Error',
        description: '¡No se pudo cargar el cliente!',
      });
      return;
    }

    setLoading(true);

    const isNewExaminationAlreadyAdded = examinations.some((examination) =>
      examination.id.toString().startsWith(NEW_ROW_ID_PREFIX),
    );

    if (isNewExaminationAlreadyAdded) {
      api.warning({
        message: 'Atención',
        description:
          'Ya estás añadiendo una nueva graduación. Por favor, guarda o cancela la nueva graduación antes de añadir otra.',
      });
      setLoading(false);
      return;
    }

    setExaminations([
      {
        id: NEW_ROW_ID_PREFIX + Date.now(),
        customerId: parseInt(customer.id, 10),
        examinationTypeId: 1, // Por defecto, asignamos Óptica Josu
      } as ExaminationModel,
      ...examinations,
    ]);

    setLoading(false);
  };

  const handleSaveSaleModal = async () => {
    if (!customer) {
      api.error({
        message: 'Error',
        description: '¡No se pudo cargar el cliente!',
      });
      return;
    }

    setLoading(true);
    try {
      await purchaseForm.validateFields();

      const formValues = await purchaseForm.validateFields();

      if (editingSale) {
        await window.electron.ipcMysql.updateSale({
          ...editingSale,
          fechaVenta: formValues.fechaVenta.format('YYYY-MM-DD'),
          productId: formValues.productId,
        });
      } else {
        const newSale = new SaleModel({
          CUSTOMER_ID: parseInt(customer.id, 10),
          PRODUCT_ID: formValues.productId,
          PRECIO_VENTA: formValues.precioVenta,
          FECHA_VENTA: formValues.fechaVenta.format('YYYY-MM-DD'),
        });
        await window.electron.ipcMysql.createSale(newSale);
      }

      // Recargamos la lista de compras del cliente para reflejar la venta creada/editada con el producto asociado
      const customerPurchasesDDBB =
        await window.electron.ipcMysql.getCustomerPurchasesById(
          parseInt(customer.id, 10),
        );
      setPurchases(customerPurchasesDDBB);

      setIsPurchaseModalOpen(false);

      api.success({
        message: 'Éxito',
        description: '¡Venta registrada correctamente!',
      });

      purchaseForm.resetFields();
    } catch (error: any) {
      if (error && error?.errorFields) {
        api.warning({
          message: 'Atención',
          description:
            'Por favor, completa todos los campos requeridos antes de guardar la venta.',
        });
        return;
      }
      const errorMsg = `Error de conexión con base de datos: ${error?.message || error}`;
      api.error({
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditOrderHistoryTable = (sale: SaleModel) => {
    openSaleModalOpen(sale);
  };

  const handleDeleteOrderHistoryTable = async (sale: SaleModel) => {
    try {
      const saleId = Number(sale.id);
      await window.electron.ipcMysql.deleteSale(saleId);

      setPurchases((prevPurchases: SaleModel[]) =>
        prevPurchases.filter(
          (purchase: SaleModel) => Number(purchase.id) !== saleId,
        ),
      );

      api.success({
        message: 'Venta del Cliente Eliminada!',
      });
    } catch (error: any) {
      api.error({
        message: 'Error',
        description: '¡No se pudo eliminar la venta!',
      });
      setErrorMessage(
        `¡No se pudo eliminar la venta! ${error?.message || error}`,
      );
    }
  };

  useEffect(() => {
    const getCustomer = async (customerId: number) => {
      try {
        const customerDDBB =
          await window.electron.ipcMysql.getCustomerById(customerId);

        if (!customerDDBB) {
          setErrorMessage(
            '¡Ha habido un error buscando el cliente seleccionado!',
          );
        }

        setCustomer(customerDDBB);

        customerForm.setFieldsValue({
          ...customerDDBB,
          // Convertimos la fecha al formato que entiende el DatePicker (dayjs),
          // porque si no le pasamos un timestamp/number, el DatePicker no lo muestra.
          fechaNacimiento: customerDDBB?.fechaNacimiento
            ? dayjs(customerDDBB.fechaNacimiento)
            : null,
        });
      } catch (error: any) {
        api.error({
          message: 'Error',
          description: '¡No se pudo obtener el cliente!',
        });
        setErrorMessage(
          `¡No se pudo obtener el cliente! ${error?.message || error}`,
        );
      }
    };

    const getCustomerExaminationsById = async (customerId: number) => {
      try {
        const customerExaminationsDDBB =
          await window.electron.ipcMysql.getCustomerExaminationsById(
            customerId,
          );

        setExaminations(customerExaminationsDDBB);
      } catch (error: any) {
        api.error({
          message: 'Error',
          description:
            '¡No se pudieron obtener las posibles graduaciones del cliente!',
        });
        setErrorMessage(
          `¡No se pudieron obtener las posibles graduaciones del cliente! ${error?.message || error}`,
        );
      } finally {
        setLoading(false);
      }
    };

    const getCustomerOrdersById = async (customerId: number) => {
      try {
        const customerExaminationsDDBB =
          await window.electron.ipcMysql.getCustomerExaminationsById(
            customerId,
          );

        setExaminations(customerExaminationsDDBB);
      } catch (error: any) {
        api.error({
          message: 'Error',
          description:
            '¡No se pudieron obtener las posibles graduaciones del cliente!',
        });
        setErrorMessage(
          `¡No se pudieron obtener las posibles graduaciones del cliente! ${error?.message || error}`,
        );
      } finally {
        setLoading(false);
      }
    };

    // Limpiamos el formulario por si acaso
    customerForm.resetFields();

    // @ts-ignore
    if (utils.isNumeric(customerIdParam)) {
      // Cliente existente, cargamos sus datos y sus graduaciones
      const customerIdAsNumber = Number(customerIdParam);
      getCustomer(customerIdAsNumber);
      getCustomerExaminationsById(customerIdAsNumber);
      getCustomerOrdersById(customerIdAsNumber);
      getExaminationTypesAndProductsForSale();
    } else {
      // Nuevo cliente, inicializamos el formulario vacío
      setIsNewCustomer(true);
      setCustomer({ id: NEW_ROW_ID_PREFIX + Date.now() } as CustomerModel);
      getExaminationTypesAndProductsForSale();
    }

    setLoading(false);
  }, [
    api,
    customerIdParam,
    customerForm,
    getExaminationTypesAndProductsForSale,
  ]);

  return (
    <AdminLayout>
      {contextHolder}
      {errorMessage ? (
        <Alert
          message="Error"
          showIcon
          type="error"
          style={{ marginBottom: 16 }}
          description={errorMessage}
        />
      ) : null}

      <Spin spinning={loading} size="large">
        <Card>
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 20 }}
          >
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(ROUTES.CUSTOMERS_MANAGER)}
            >
              Volver al listado de clientes
            </Button>

            <h2 style={{ color: '#5e7b8a' }}>
              {isNewCustomer ? 'Creando Nuevo Cliente' : 'Editando Cliente'}
            </h2>
          </Row>

          <Form
            form={customerForm}
            onFinish={handleCustomerSubmit}
            layout="vertical"
          >
            {/* DATOS PERSONALES */}
            <Divider orientation="left">
              <UserOutlined /> Datos Personales
            </Divider>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item required name="nombre" label="Nombre">
                  <Input required />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item required name="apellidos" label="Apellidos">
                  <Input required />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="DNI" label="DNI / NIE / Pasaporte">
                  <Input prefix={<IdcardOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  required
                  name="fechaNacimiento"
                  label="Fecha de Nacimiento"
                >
                  <DatePicker
                    required
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    placeholder="Seleccionar fecha..."
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* CONTACTO Y DIRECCIÓN */}
            <Divider orientation="left">
              <HomeOutlined /> Contacto y Ubicación
            </Divider>

            <Row gutter={16}>
              <Col xs={24} sm={5}>
                <Form.Item required name="telefono" label="Teléfono">
                  <Input required prefix={<PhoneOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={5}>
                <Form.Item name="telefonoAdicional" label="Teléfono Adicional">
                  <Input prefix={<PhoneOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={14}>
                <Form.Item name="direccion" label="Dirección">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={16}>
                <Form.Item name="ciudad" label="Ciudad">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="codigoPostal" label="Código Postal">
                  <Input style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            {/* OBSERVACIONES */}
            <Divider orientation="left">Notas Adicionales</Divider>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="notes" label="Notas internas">
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="end">
              <Button
                htmlType="submit"
                type="primary"
                size="large"
                icon={<SaveOutlined />}
                style={{ backgroundColor: '#13c2c2', borderColor: '#13c2c2' }}
              >
                Guardar Cliente
              </Button>
            </Row>
          </Form>

          {/* SECCIÓN DE HISTORIALES */}
          <div hidden={isNewCustomer}>
            <ConfigProvider
              theme={{
                components: {
                  Tabs: {
                    itemSelectedColor: '#13c2c2',
                    itemHoverColor: '#08979c',
                    itemColor: '#484848',
                  },
                },
              }}
            >
              <Tabs
                defaultActiveKey="1"
                type="card"
                style={{ marginTop: 20 }}
                tabBarStyle={{ marginBottom: 0 }}
                hidden={isNewCustomer}
                items={[
                  {
                    key: '1',
                    label: (
                      <span
                        style={{
                          padding: '4px 12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '20px',
                          fontWeight: 600,
                        }}
                      >
                        <EyeOutlined />
                        Historial de Graduaciones
                      </span>
                    ),
                    children: (
                      <div
                        style={{ border: '1px solid #f0f0f0', padding: '20px' }}
                      >
                        <div style={{ marginTop: 10, marginBottom: 20 }}>
                          <Button
                            type="dashed"
                            size="large"
                            icon={<PlusOutlined />}
                            style={{
                              borderColor: '#13c2c2',
                              color: '#13c2c2',
                              fontWeight: 500,
                            }}
                            onClick={handleNewExaminationForm}
                          >
                            Nueva Graduación
                          </Button>
                        </div>

                        {examinations.map((examination, i) => (
                          <ExaminationForm
                            key={`examination-form-${examination.id}`}
                            examination={examination}
                            examinationTypes={examinationTypes}
                            isLastExamination={i === 0}
                            onSaveExamination={handleSaveExaminationForm}
                            onDeleteExamination={handleDeleteExaminationForm}
                          />
                        ))}
                      </div>
                    ),
                  },
                  {
                    key: '2',
                    label: (
                      <span
                        style={{
                          padding: '4px 12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '20px',
                          fontWeight: 600,
                        }}
                      >
                        <HistoryOutlined />
                        Historial de Pedidos
                      </span>
                    ),
                    children: (
                      <div
                        style={{ border: '1px solid #f0f0f0', padding: '20px' }}
                      >
                        <div style={{ marginTop: 10, marginBottom: 20 }}>
                          <Button
                            type="dashed"
                            size="large"
                            icon={<PlusOutlined />}
                            style={{
                              borderColor: '#13c2c2',
                              color: '#13c2c2',
                              fontWeight: 500,
                            }}
                            onClick={() => openSaleModalOpen()}
                          >
                            Nueva Venta
                          </Button>

                          <Modal
                            title={`${editingSale ? 'Editar' : 'Nueva'} Venta`}
                            open={isPurchaseModalOpen}
                            onOk={() => handleSaveSaleModal()}
                            onCancel={() => setIsPurchaseModalOpen(false)}
                            okText="Guardar"
                            cancelText="Cancelar"
                            okButtonProps={{
                              style: {
                                backgroundColor: '#13c2c2',
                                borderColor: '#13c2c2',
                              },
                            }}
                          >
                            <p>Introduce los datos de la nueva venta.</p>
                            <Form
                              form={purchaseForm}
                              layout="vertical"
                              initialValues={{
                                fechaVenta: dayjs(), // Por defecto, mostar fecha de hoy
                              }}
                            >
                              <Form.Item
                                name="fechaVenta"
                                label="Fecha de Venta"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Por favor, selecciona la fecha',
                                  },
                                ]}
                              >
                                <DatePicker
                                  style={{ width: '100%' }}
                                  format="DD/MM/YYYY"
                                />
                              </Form.Item>

                              <Form.Item
                                name="productId"
                                label="Buscar Producto por Referencia o Modelo"
                                style={{ marginBottom: 0 }}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Selecciona un producto',
                                  },
                                ]}
                              >
                                <Select
                                  showSearch
                                  placeholder="Escribe el nombre o código del producto..."
                                  optionFilterProp="children"
                                  style={{ width: '100%' }}
                                  filterOption={(input, option) =>
                                    (option?.label ?? '')
                                      .toUpperCase()
                                      .includes(input.toUpperCase())
                                  }
                                  filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '')
                                      .toUpperCase()
                                      .localeCompare(
                                        (optionB?.label ?? '').toUpperCase(),
                                      )
                                  }
                                  options={allProductsForSale.map(
                                    (product) => ({
                                      value: product.id,
                                      label: `${product.referencia} - ${product.modelo ?? 'Sin Modelo Definido'} - ${product.precioVenta ? `${product.precioVenta} €` : 'Sin Precio Venta'}`,
                                    }),
                                  )}
                                />
                              </Form.Item>
                            </Form>
                          </Modal>
                        </div>

                        {purchases.length > 0 ? (
                          <OrderHistoryTable
                            purchases={purchases}
                            onEdit={handleEditOrderHistoryTable}
                            onDelete={handleDeleteOrderHistoryTable}
                          />
                        ) : (
                          <p
                            style={{
                              color: '#8c8c8c',
                              fontStyle: 'italic',
                              fontSize: '18px',
                            }}
                          >
                            No hay pedidos registrados para este cliente.
                          </p>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </ConfigProvider>
          </div>
        </Card>
      </Spin>
    </AdminLayout>
  );
};

export default CustomerManagerFormPage;
