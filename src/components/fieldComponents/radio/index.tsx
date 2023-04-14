import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Radio, RadioProps } from 'antd';
import { noop } from 'lodash';

import { FieldProps } from '../types';

import cx from './index.less';

interface selectValue {
  label: string;
  value: string | number;
}

export type BaseFieldProps = RadioProps &
  FieldProps & {
    value?: string;
    options?: selectValue[];
    onChange?: (e: any) => void;
  };
const RadioComponent: React.FC<BaseFieldProps> = props => {
  const { onChange, disabled, value: propsValue, options: propsOptions, ...defaultProps } = props;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(null);

  const options = useMemo(() => {
    return propsOptions || [];
  }, [propsOptions]);
  useEffect(() => {
    document.addEventListener('click', handleFunction);
    return () => {
      document.removeEventListener('click', handleFunction);
    };
  }, [editing]);
  const handleFunction = () => {
    setEditing(false);
  };
  useEffect(() => {
    // options为空时，不展示value
    if (options.length) {
      setValue(propsValue);
    }
  }, [propsValue, setValue, options]);

  const handleChange = useCallback(
    e => {
      setValue(e.target.value);
      onChange?.(e.target.value);
    },
    [setValue, onChange],
  );
  const clearValue = e => {
    if (value === e.target.value) {
      setValue(null);
      onChange?.(null);
    }
  };

  return (
    <div className={`${cx('field-value-radio')} field-value-overlay`}>
      <Radio.Group onChange={handleChange} value={value} {...defaultProps} disabled={disabled}>
        {options.map(item => (
          <Radio key={item.value} value={item.value} onClick={clearValue}>
            {item.label}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );
};

RadioComponent.defaultProps = {
  onChange: noop,
  readonly: false,
  editMode: false,
  options: [],
};

export default RadioComponent;
