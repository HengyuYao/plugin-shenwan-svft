import React from 'react';

import PureField from './pure-field/PureField';

import './FormField.global.less';

type BaseFormFieldInterface = {
  children: any;
  name: string;
  label?: React.ReactNode;
  layout?: 'horizontal' | 'vertical';
  required?: boolean;
  className?: string;
  style?: any;
};

// 因为rest的参数形式可能是任意类型
type FormFieldWithRest = BaseFormFieldInterface & Record<string, any>;

const FormField = ({
  children,
  name,
  label,
  layout = 'vertical',
  required = false,
  style = {},
  className = '',
  ...rest
}: FormFieldWithRest): any => {
  const labelNode = (() => {
    if (label) {
      if (typeof label === 'string') {
        return (
          <div className="form-field-label">
            {required && <span className="form-field-required">*</span>}
            <span>{label}</span>
          </div>
        );
      }
      return label;
    }
    return null;
  })();
  return (
    <div className={`form-field-${layout} ${className}`} style={style}>
      {labelNode}
      <div className="form-field-input">
        <PureField name={name} {...rest}>
          {({ field, form, meta }) => {
            const fixedProps = {
              field: { ...field },
              form,
              meta,
            };
            return children(fixedProps);
          }}
        </PureField>
      </div>
    </div>
  );
};

export default FormField;
export * from './pure-field/FormikEnhance';
