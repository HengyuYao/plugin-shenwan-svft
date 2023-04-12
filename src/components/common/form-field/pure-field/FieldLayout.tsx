import { useMemo } from 'react';
import classNames from 'classnames';

import { FieldLayoutProps } from '../types';

import '../FormField.global.less';

const FieldLayout: React.FC<FieldLayoutProps> = ({
  className,
  children = null,
  errors = [],
  style,
  labelWidth,
  labelAlign,
}) => {
  const hasError = useMemo(
    () => Array.isArray(errors) && errors.some(e => e && e.level === 'error' && 'message' in e),
    [errors],
  );

  const hasWarning = useMemo(
    () => Array.isArray(errors) && errors.some(e => e && e.level === 'warning' && 'message' in e),
    [errors],
  );

  const printableErrors = useMemo(() => {
    if (Array.isArray(errors)) {
      return errors.filter(e => e && e.message);
    }
    return [];
  }, [errors]);

  return (
    <div className={className ? 'form-field-layout-root ' + className : 'form-field-layout-root'} style={style}>
      <div
        className={classNames('form-field-layout-root-input', {
          'form-field-error': hasError,
          'form-field-warning': hasWarning,
        })}
      >
        <div className={'form-field-control'}>{children}</div>
        {/* 错误消息默认占位一行，没有错误的时候充当间距的作用，尽可能减少有错误的时候引起整个表单高度明显变化 */}
        <div
          style={{
            paddingLeft: labelAlign === 'top' ? 0 : labelWidth ? `${labelWidth}px` : 0,
          }}
          className="form-field-error-message-wrapper"
        >
          {printableErrors.map(({ message, level }, index) => (
            <div key={index} className={`form-field-${level}-message`}>
              {message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldLayout;
