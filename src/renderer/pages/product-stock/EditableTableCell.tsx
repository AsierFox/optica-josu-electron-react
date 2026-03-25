import { DatePicker, Form, Input, InputNumber, Select } from 'antd';
import React from 'react';
import ProductModel from '../../../main/models/product.model';
import utils from '../../utils/util';

const EditableTableCell = ({
  dataIndex,
  required = false,
  type = 'text',
  record,
  editingProduct,
  selectOptions = [],
  children,
  ...restProps
}: {
  dataIndex: keyof ProductModel;
  required: boolean;
  type?: 'text' | 'number' | 'date' | 'money' | 'select';
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
      inputNode = <DatePicker format="YYYY-MM-DD" />;
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
        />
      );
      break;
    case 'select':
      inputNode = (
        <Select
          style={{ width: '100%' }}
          placeholder="Tipo de producto..."
          options={selectOptions}
        />
      );
      break;
    default:
      inputNode = <Input type={type} />;
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

export default EditableTableCell;
