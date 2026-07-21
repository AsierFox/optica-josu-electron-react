import { Table } from 'antd';
import React from 'react';
import ProductModel from '../../main/models/product.model';
import TableEditableCell from './TableEditableCell';

interface Props {
  loading: boolean;
  dataSource: ProductModel[];
  columns: any;
}

const ProductStockTable: React.FC<Props> = ({
  loading,
  columns,
  dataSource,
}) => {
  return (
    <Table
      rowKey="id"
      bordered
      sticky
      scroll={{ x: 'max-content' }}
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      components={{
        body: {
          // Componente de celda que usa Form.Item
          cell: TableEditableCell,
        },
      }}
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

export default ProductStockTable;
