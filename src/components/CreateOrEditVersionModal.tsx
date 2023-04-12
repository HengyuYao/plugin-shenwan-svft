import React, { useMemo, useRef, useState } from 'react';
import { DateCell, DropdownCell, TextCell } from '@giteeteam/apps-team-components';
import { DatePicker, Input, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Formik } from 'formik';
import { isEmpty, omit, set } from 'lodash';

import { addErrorMessage, FormField, FormikFieldTouched } from '@/components/common';
// import useFields from 'components/fields/hooks/useFields';
// import dayjs from 'lib/dayjs';
import { INCLUDE_VERSION_EXPAND_FIELD_TYPES } from '@/lib/global';
// import useI18n from 'lib/hooks/useI18n';
import { FormError } from '@/lib/types/common';
import { AddItemReleaseModalProps } from '@/lib/types/version';

import { Number } from './fieldComponents/index';
import { useExpandFields } from './hooks';

import cx from './version.less';

const { RangePicker } = DatePicker;
const componentsInit = (type: string) => {
  switch (type) {
    case 'Date':
      return DateCell;
    case 'Dropdown':
      return DropdownCell;
    case 'Text':
      return TextCell;
    case 'Number':
      return Number; // TODO: 从apps-team-components引入的number字段样式会丢失，暂时用重写的
    default:
      null;
  }
};
/*
 * 版本管理弹窗
 * */
const AddVersionModal: React.FC<AddItemReleaseModalProps> = props => {
  const { title, visible, onClose, onSubmit, initialValue, moduleName } = props;
  const { expandFields } = useExpandFields();
  const formikRef = useRef(null);
  const _initialValue = useMemo(() => {
    if (!initialValue?.expandFieldValues) {
      return {
        ...initialValue,
        expandFieldValues: {},
      };
    }
    return initialValue;
  }, [initialValue]);

  const [confirmLoading, setConfirmLoading] = useState(false);

  const validate = async value => {
    const errors: FormError = {};
    if (!value.name || !value.name.trim()) {
      errors.name = addErrorMessage(errors.name, 'name有误');
    } else if (value.name.trim().length > 30) {
      errors.name = addErrorMessage(errors.name, '长度有误');
    }
    if (!value.range || !value.range.length) {
      errors.range = addErrorMessage(errors.range, '必填');
    }
    if (value.description && value.description.length > 200) {
      errors.description = addErrorMessage(errors.description, '描述有误');
    }

    if (value.expandFieldValues) {
      expandFields?.forEach(field => {
        if (!value.expandFieldValues[field.key] && field.required) {
          set(errors, `expandFieldValues.${field.key}`, `${field.name}错误`);
        }
      });
    }

    return errors;
  };

  const onSubmitForm = values => {
    onSubmit(values, setConfirmLoading);
  };
  const CustomLabel = ({ label, required }: { label: string; required?: boolean }) => {
    return (
      <div className="custom_label">
        {label}
        {required && <span className="required">*</span>}
      </div>
    );
  };
  return (
    <Formik
      initialValues={_initialValue}
      values={_initialValue}
      onSubmit={onSubmitForm}
      validate={validate}
      innerRef={formikRef}
      enableReinitialize
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <Modal
          maskClosable={false}
          title={title}
          visible={visible}
          onCancel={onClose}
          // okText={t('global.modal.okText')}
          // cancelText={t('global.modal.cancelText')}
          onOk={() => {
            expandFields.forEach(field => {
              // 保存时把字段默认值同步到formik表单中，否则校验不生效
              if (
                values?.expandFieldValues?.[field.key] === undefined &&
                field.property?.defaultValue
              ) {
                formikRef?.current?.setFieldValue(
                  `expandFieldValues.${field.key}`,
                  field.property.defaultValue,
                );
              }
            });
            handleSubmit();
          }}
          confirmLoading={confirmLoading}
          className={cx('version-modal')}
        >
          <FormikFieldTouched />
          <FormField name="name" required>
            {({ field }) => {
              return (
                <>
                  <CustomLabel label="名称" required />
                  <Input {...field} />
                </>
              );
            }}
          </FormField>
          <FormField name="range" required>
            {({ field }) => {
              const { value, ...rest } = field; // rangePicker不支持默认的value
              return (
                <>
                  <CustomLabel label="范围" required />
                  <RangePicker
                    {...rest}
                    value={value ? [dayjs(value[0]), dayjs(value[1])] : null}
                    onChange={date => {
                      setFieldValue('range', date ? date : null);
                    }}
                    // placeholder={[
                    //   t('pages.version.addVersionModal.startDate'),
                    //   t('pages.version.addVersionModal.releaseDate'),
                    // ]}
                  />
                </>
              );
            }}
          </FormField>
          <FormField name="description">
            {({ field }) => {
              return (
                <>
                  <CustomLabel label="描述" />
                  <Input.TextArea {...field} />
                </>
              );
            }}
          </FormField>
          {!!expandFields?.length && (
            // <div className={cx('expand-text')}>{t('pages.fields.default.versionExpandField')}</div>
            <div className={cx('expand-text')}>拓展字段</div>
          )}
          {expandFields?.map(ele => {
            const FieldComponent = componentsInit(ele.fieldType.component);
            const commonData = {
              editMode: isEmpty(ele.editMode) ? true : ele.editMode,
              options: ele.data && ele.data.customData,
              value: ele.property && ele.property.defaultValue,
              objectId: ele?.objectId,
              label: ele.name,
              disabled: ele.readonly,
              required: ele.required,
              labelAlign: 'top',
              description: ele.property.fieldDesc,
              ...omit(ele.data, ['customData']),
              ...omit(ele.property, ['defaultValue']),
            };
            return (
              FieldComponent && (
                <FormField name={`expandFieldValues.${ele.key}`} key={ele.key}>
                  {({ field }) => {
                    // 新建字段未赋值时field.value为undefined
                    const value = field.value === undefined ? commonData.value : field.value;
                    return <FieldComponent {...commonData} {...field} value={value} />;
                  }}
                </FormField>
              )
            );
          })}
        </Modal>
      )}
    </Formik>
  );
};

export default AddVersionModal;
