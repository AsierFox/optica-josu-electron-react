import { DatePicker, Form, Input, InputNumber, Select } from 'antd';
import { NamePath } from 'antd/es/form/interface';
import React from 'react';
import ProductModel from '../../main/models/product.model';
import utils from '../utils/util';

const TableEditableCell = ({
  dataIndex,
  required = false,
  type = 'text',
  disabled = false,
  record,
  editingProduct,
  selectOptions = [],
  children,
  ...restProps
}: {
  dataIndex: NamePath;
  required: boolean;
  type?: 'text' | 'number' | 'date' | 'money' | 'select';
  disabled?: boolean;
  record: ProductModel;
  editingProduct: ProductModel | null;
  selectOptions?: { label: string; value: number }[];
  children: React.ReactNode;
  restProps?: React.HTMLAttributes<HTMLElement>;
}) => {
  const isThisCellBeingEdited =
    editingProduct && record && editingProduct?.id === record?.id;
  if (!isThisCellBeingEdited) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <td {...restProps}>{children}</td>;
  }

  let inputNode: React.ReactNode;

  switch (type) {
    case 'date':
      inputNode = <DatePicker format="YYYY-MM-DD" disabled={disabled} />;
      break;
    case 'money':
      inputNode = (
        <InputNumber
          min={0}
          step={0.01}
          addonAfter="€"
          stringMode
          formatter={utils.priceInputFormatter}
          parser={utils.priceInputParser}
          disabled={disabled}
        />
      );
      break;
    case 'select':
      inputNode = (
        <Select
          style={{ width: '100%' }}
          placeholder="Tipo de producto..."
          options={selectOptions}
          disabled={disabled}
        />
      );
      break;
    default:
      inputNode = <Input type={type} disabled={disabled} />;
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <td {...restProps}>
      <Form.Item
        // Crucial: vincula el input con el campo del objeto
        name={dataIndex}
        style={{ margin: 0 }}
        rules={[
          {
            required,
            message: `Por favor, introduce este campo obligatorio.`,
          },
        ]}
      >
        {inputNode}
      </Form.Item>
    </td>
  );
};

export default TableEditableCell;
