import { useEffect, useMemo } from 'react';
import { setNestedObjectValues, useFormikContext } from 'formik';
import { cloneDeep, merge } from 'lodash';

// 该模块用于在提交之前，把所有有错误的字段的 touched 标识设置为 true
const FormikFieldTouched = (): any => {
  const { errors, setTouched, isSubmitting, validateForm, touched } = useFormikContext();
  // 根据已点击过的字段和所有的 errors 字段拼凑出较为完整的 touched 字段
  const fields = useMemo(() => {
    // 此处的 cloneDeep 需要保留，不能被优化掉
    return merge(cloneDeep(touched), cloneDeep(errors));
  }, [JSON.stringify(touched), errors]);

  useEffect(() => {
    if (isSubmitting) {
      (async () => await validateForm())();
      setTouched(setNestedObjectValues(fields, true));
    }
  }, [errors, isSubmitting, setTouched, validateForm, fields]);
  return null;
};

export default FormikFieldTouched;
