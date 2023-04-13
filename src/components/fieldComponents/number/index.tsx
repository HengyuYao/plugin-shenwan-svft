import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input, InputNumber, Tag } from 'antd';
import { isNil, isNumber } from 'lodash';

import { BaseFieldProps } from '../types';

import cx from './index.less';
/* 四舍五入格式化数字：value: 要格式话的值  precision: 精度*/
export const numberPrecisionInit = (value: number, precision: number): number => {
  return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
};

export const NumberMaxMin = {
  // 数值最大值和最小值
  Max: 999999999,
  Min: -999999999,
};

export const numberRangeInit = (val: number, defaultValue: number): number => {
  return isNumber(val) ? val : defaultValue;
};

export const numberFixed = (type: string, val: number, precision: number): number | string => {
  return type === 'int'
    ? numberPrecisionInit(val, 0)
    : numberPrecisionInit(val, precision).toFixed(precision);
};

const FieldNumber: React.FC<BaseFieldProps> = props => {
  const {
    onChange,

    placeholder,
    value: propsValue, // value重命名
    addonBefore,
    addonAfter,
    max,
    min,
    step,
    type,
    precision,

    disabled,
  } = props;
  const [showValue, setShowValue] = useState(null);

  const targetRef = useRef(null);

  useEffect(() => {
    if (isNumber(propsValue)) {
      const value = numberFixed(type, propsValue, precision);
      setShowValue(value);
    } else {
      // 初始值格式化为undefined, blur后如果值为空则转换为null
      setShowValue(undefined);
    }
  }, [propsValue, precision, type]);
  const onChangeBlur = useCallback(
    e => {
      const isOutMax = Number(e.target.value) > numberRangeInit(max, NumberMaxMin.Max);
      const isOutMin = Number(e.target.value) < numberRangeInit(min, NumberMaxMin.Min);
      const isOutRange = isOutMax || isOutMin;

      let value = null;
      if (!e.target.value || isNaN(Number(e.target.value))) {
        value = null;
      } else if (isOutRange && e.target.value) {
        value = isNumber(propsValue) ? propsValue : null;
      } else {
        value = e.target.value?.trim() ? Number(e.target.value) : null;
      }
      const initValue = isNil(value)
        ? null
        : type === 'int'
        ? numberPrecisionInit(value, 0)
        : numberPrecisionInit(value, precision);
      if (!isNil(initValue)) {
        // when the initValue was null ,it will throw "toFixed of undefined" error
        setShowValue(initValue.toFixed(type === 'int' ? 0 : precision));
      } else {
        setShowValue(null);
      }
      onChange?.(initValue);
    },
    [onChange, max, min, propsValue, setShowValue, precision, type],
  );

  const handleNumberChange = useCallback(
    val => {
      const value = numberFixed(type, val, precision);
      setShowValue(value);
    },
    [type, precision],
  );

  return (
    <div className="field-value-overlay">
      <Input.Group compact className={`${cx('number_field')} field-value-overlay-component`}>
        {addonBefore ? <Tag className={cx('addonBefore_class')}>{addonBefore}</Tag> : <></>}
        <InputNumber
          style={{ flex: 1 }}
          ref={targetRef}
          onBlur={onChangeBlur}
          placeholder={placeholder}
          max={numberRangeInit(max, NumberMaxMin.Max)}
          min={numberRangeInit(min, NumberMaxMin.Min)}
          step={type === 'int' ? step : 1 / Math.pow(10, precision)}
          value={showValue}
          onStep={handleNumberChange}
          precision={type === 'int' ? 0 : precision}
          disabled={disabled}
        />
        {addonAfter ? <Tag className={cx('addonAfter_class')}>{addonAfter}</Tag> : <></>}
      </Input.Group>
    </div>
  );
};
FieldNumber.defaultProps = {
  required: false,
  addonBefore: '',
  addonAfter: '',
  type: 'int',
  step: 1,
  precision: 1,
};

export default FieldNumber;
