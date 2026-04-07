import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table } from 'antd';
import React, { useMemo } from 'react';
import ClientModel from '../../../main/models/client.model';
import ProductModel from '../../../main/models/product.model';
import ProductTypeModel from '../../../main/models/productType.model';
import { CLIENT_FIELD_NAMES } from '../../app/constants';
import utils from '../../utils/util';

interface Props {
  loading: boolean;
  dataSource: ClientModel[];
  clients: ClientModel[]; // Para los filtros
  productTypes: ProductTypeModel[];
  onEdit: (record: ClientModel) => void;
  onDelete: (record: ClientModel) => void;
}

const ClientManagerTable: React.FC<Props> = ({
  loading,
  dataSource,
  clients,
  productTypes,
  onEdit,
  onDelete,
}) => {
  const columns: any = useMemo(() => {
    const proveedorFilters = utils
      .uniq(
        clients
          .filter((c) => c.proveedor)
          .map((client: ClientModel) => client.proveedor?.toUpperCase()),
      )
      .map((filter: string) => ({ text: filter, value: filter }));

    return [
      {
        title: CLIENT_FIELD_NAMES.id,
        dataIndex: 'id',
      },
      {
        title: CLIENT_FIELD_NAMES.nombre,
        dataIndex: 'nombre',
        filters: proveedorFilters,
        filterSearch: true,
        onFilter: (value: string, record: ProductModel) =>
          utils.equalsStrings(record.nombre, value),
        sorter: (a: ProductModel, b: ProductModel) =>
          a.proveedor?.localeCompare(b?.nombre),
      },
      {
        title: CLIENT_FIELD_NAMES.apellidos,
        dataIndex: 'apellidos',
      },
      {
        title: CLIENT_FIELD_NAMES.direccion,
        dataIndex: 'direccion',
      },
      {
        title: CLIENT_FIELD_NAMES.ciudad,
        dataIndex: 'ciudad',
      },
      {
        title: CLIENT_FIELD_NAMES.codigoPostal,
        dataIndex: 'codigoPostal',
      },
      {
        title: CLIENT_FIELD_NAMES.telefono,
        dataIndex: 'telefono',
      },
      {
        title: CLIENT_FIELD_NAMES.DNI,
        dataIndex: 'DNI',
      },
      {
        title: CLIENT_FIELD_NAMES.fechaNacimiento,
        dataIndex: 'fechaNacimiento',
      },
      {
        title: CLIENT_FIELD_NAMES.notes,
        dataIndex: 'notes',
      },
      {
        title: 'Operaciones',
        fixed: 'right',
        render: (_: any, record: ClientModel) => (
          <Space>
            <Button
              size="small"
              color="cyan"
              variant="dashed"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              Editar
            </Button>
            <Popconfirm
              title="¿Desea borrar producto?"
              onConfirm={() => onDelete(record)}
            >
              <Button danger size="small" icon={<DeleteOutlined />}>
                Eliminar
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients, productTypes, onEdit, onDelete]);

  return (
    <Table
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      scroll={{ x: 'max-content' }}
      pagination={{
        defaultPageSize: 50,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100', '500'],
        position: ['bottomCenter'],
        showTotal: (total, range) =>
          `Mostrando ${range[1] - range[0] + 1} de un total de ${total} productos`,
      }}
    />
  );
};

export default React.memo(ClientManagerTable);
