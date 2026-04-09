import {
  EditOutlined,
  FileSearchOutlined,
  PhoneFilled,
} from '@ant-design/icons';
import { Button, Col, Input, Row, Space, Table, Typography } from 'antd';
import React, { useMemo } from 'react';
import ClientModel from '../../../main/models/client.model';
import { CLIENT_FIELD_NAMES } from '../../app/constants';
import utils from '../../utils/util';

const { Text } = Typography;

interface Props {
  loading: boolean;
  dataSource: ClientModel[];
  onEdit: (record: ClientModel) => void;
}

const ClientManagerTable: React.FC<Props> = ({
  loading,
  dataSource,
  onEdit,
}) => {
  const [searchFilters, setSearchFilters] = React.useState<
    // Field name -> search value
    Record<string, string>
  >({});

  const columns: any = useMemo(() => {
    return [
      {
        title: CLIENT_FIELD_NAMES.id,
        dataIndex: 'id',
      },
      {
        title: CLIENT_FIELD_NAMES.nombre,
        dataIndex: 'nombre',
        sorter: (a: ClientModel, b: ClientModel) =>
          a.nombre?.localeCompare(b?.nombre),
      },
      {
        title: CLIENT_FIELD_NAMES.apellidos,
        dataIndex: 'apellidos',
        sorter: (a: ClientModel, b: ClientModel) =>
          a.apellidos?.localeCompare(b?.apellidos),
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
        render: (value: string) =>
          // @ts-ignore
          value ? utils.formatDateToYYYYMMDD(value) : null,
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
          </Space>
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onEdit]);

  const filteredDataSource = useMemo(() => {
    return dataSource.filter((item) => {
      return Object.entries(searchFilters).every(([field, value]) => {
        switch (field) {
          case 'nombre': {
            const fullName = `${item.nombre} ${item.apellidos}`.toLowerCase();
            if (fullName.includes(value.toLowerCase())) {
              return true;
            }
            return false;
          }
          case 'telefono': {
            if (item.telefono?.includes(value)) {
              return true;
            }
            return false;
          }
          default:
            return false;
        }
      });
    });
  }, [dataSource, searchFilters]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* FILTROS */}
      <Row gutter={[24, 16]}>
        <Col>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong style={{ marginBottom: '4px', color: '#595959' }}>
              Búsqueda por Nombre y Apellidos
            </Text>
            <Input
              placeholder="Nombre o Apellidos..."
              prefix={<FileSearchOutlined style={{ color: '#13c2c2' }} />}
              onChange={(e) =>
                setSearchFilters((prev) => ({
                  ...prev,
                  nombre: e.target.value,
                }))
              }
              style={{ width: 350 }}
              allowClear
            />
          </div>
        </Col>

        <Col>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong style={{ marginBottom: '4px', color: '#595959' }}>
              Búsqueda por Teléfono
            </Text>
            <Input
              placeholder="Teléfono..."
              prefix={<PhoneFilled style={{ color: '#13c2c2' }} />}
              onChange={(e) =>
                setSearchFilters((prev) => ({
                  ...prev,
                  telefono: e.target.value,
                }))
              }
              style={{ width: 300 }} // Un poco más estrecho para el teléfono
              allowClear
            />
          </div>
        </Col>
      </Row>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={filteredDataSource}
        scroll={{ x: 'max-content' }}
        pagination={{
          defaultPageSize: 50,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '500'],
          position: ['bottomCenter'],
          showTotal: (total, range) =>
            `Mostrando ${range[1] - range[0] + 1} de un total de ${total} clientes`,
        }}
      />
    </div>
  );
};

export default React.memo(ClientManagerTable);
