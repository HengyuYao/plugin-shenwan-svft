import { Field } from 'formik';
import { isArray, pick } from 'lodash';

import FieldLayout from './FieldLayout';

const fakeEvent = (name: string, value): any => ({ target: { name, value } });

const layoutProps = ['errors', 'className', 'style', 'labelWidth', 'labelAlign'];

const formikProps = ['as', 'children', 'component', 'innerRef', 'render', 'validate'];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const PureField = ({ type = '', name, children, ...rest }): any =>
  name ? (
    <Field {...pick(rest, formikProps)} type={type} name={name}>
      {({ field, form, meta }) => {
        const { name } = field;
        const { handleChange, validateOnMount, setFieldTouched } = form;
        const { error, touched } = meta;
        const errors = (() => {
          const errors = rest?.warning || [];
          if (!validateOnMount && !touched) {
            // 不是初始化时校验或没有点击过，则直接返回
            return errors;
          }
          if (isArray(error)) {
            return [...errors, ...error];
          }
          // 兼容一下 Yup，默认都给到 error 级别的提示
          if (typeof error === 'string' && error.length) {
            errors.push({
              message: error,
              level: 'error',
            });
          }
          return errors;
        })();
        // TODO 这里不得不用了handleChange，等formik修复
        // @see https://github.com/jaredpalmer/formik/issues/2130
        const onChange = mixed => {
          if (!touched) {
            setFieldTouched(name, true);
          }
          if (mixed?.target) {
            handleChange(mixed);
          } else {
            handleChange(fakeEvent(name, mixed));
          }
        };

        const fixedProps = {
          field: { ...field, onChange },
          form,
          meta,
        };

        return (
          <FieldLayout {...pick(rest, layoutProps)} errors={errors}>
            {typeof children === 'function' ? children(fixedProps) : children}
          </FieldLayout>
        );
      }}
    </Field>
  ) : (
    <FieldLayout {...pick(rest, layoutProps)}>{children}</FieldLayout>
  );

export default PureField;
export * from './FormikEnhance';
