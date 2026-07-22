import {
  EditOutlined,
  FileSearchOutlined,
  PhoneFilled,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Col, Input, Row, Space, Table, Typography } from 'antd';
import React, { useMemo } from 'react';
import CustomerModel from '../../../main/models/customer.model';
import { CUSTOMERS_FIELD_NAMES } from '../../app/constants';
import utils from '../../utils/util';

const { Text } = Typography;

interface Props {
  loading: boolean;
  dataSource: CustomerModel[];
  onEdit: (record: CustomerModel) => void;
}

const CustomerManagerTable: React.FC<Props> = ({
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
        title: CUSTOMERS_FIELD_NAMES.id,
        dataIndex: 'id',
      },
      {
        title: CUSTOMERS_FIELD_NAMES.nombre,
        dataIndex: 'nombre',
        sorter: (a: CustomerModel, b: CustomerModel) =>
          (a.nombre ?? '').localeCompare(b.nombre ?? ''),
      },
      {
        title: CUSTOMERS_FIELD_NAMES.apellidos,
        dataIndex: 'apellidos',
        sorter: (a: CustomerModel, b: CustomerModel) =>
          (a.apellidos ?? '').localeCompare(b.apellidos ?? ''),
      },
      {
        title: CUSTOMERS_FIELD_NAMES.direccion,
        dataIndex: 'direccion',
      },
      {
        title: CUSTOMERS_FIELD_NAMES.ciudad,
        dataIndex: 'ciudad',
      },
      {
        title: CUSTOMERS_FIELD_NAMES.codigoPostal,
        dataIndex: 'codigoPostal',
      },
      {
        title: CUSTOMERS_FIELD_NAMES.telefono,
        dataIndex: 'telefono',
      },
      {
        title: CUSTOMERS_FIELD_NAMES.DNI,
        dataIndex: 'DNI',
      },
      {
        title: CUSTOMERS_FIELD_NAMES.fechaNacimiento,
        dataIndex: 'fechaNacimiento',
        render: (value: string) =>
          // @ts-ignore
          value ? utils.formatDateToYYYYMMDD(value) : null,
      },
      {
        title: CUSTOMERS_FIELD_NAMES.notes,
        dataIndex: 'notes',
      },
      {
        title: 'Operaciones',
        fixed: 'right',
        render: (_: any, record: CustomerModel) => (
          <Space>
            <Button
              size="small"
              color="cyan"
              variant="dashed"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              Ver / Editar
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
        // Si el filtro está vacío, no filtramos
        if (!value) {
          return true;
        }

        switch (field) {
          case 'nombre': {
            const fullName = `${item.nombre} ${item.apellidos}`.toLowerCase();
            if (fullName.includes(value.toLowerCase())) {
              return true;
            }
            return false;
          }
          default: {
            const key = field as keyof CustomerModel;
            const fieldValue = item[key];
            if (typeof fieldValue === 'string' && fieldValue.includes(value)) {
              return true;
            }
            return false;
          }
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
              prefix={<SearchOutlined style={{ color: '#13c2c2' }} />}
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

        <Col>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong style={{ marginBottom: '4px', color: '#595959' }}>
              Búsqueda por DNI
            </Text>
            <Input
              placeholder="DNI..."
              prefix={<FileSearchOutlined style={{ color: '#13c2c2' }} />}
              onChange={(e) =>
                setSearchFilters((prev) => ({
                  ...prev,
                  DNI: e.target.value,
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
        bordered
        sticky
        scroll={{ x: 'max-content' }}
        loading={loading}
        columns={columns}
        dataSource={filteredDataSource}
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

export default React.memo(CustomerManagerTable);
