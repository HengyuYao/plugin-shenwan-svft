import React, { useCallback, useMemo, useRef, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { DateCell, DropdownCell, TextCell } from '@giteeteam/apps-team-components';
import { Col, DatePicker, Input, message, Modal, Row, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { Formik } from 'formik';
import { isEmpty, omit, set } from 'lodash';

import { FormField, FormikFieldTouched } from '@/components/common/form-field';
import { FormError } from '@/lib/types/common';
import { AddItemReleaseModalProps } from '@/lib/types/version';

import { Number, Radio } from './fieldComponents/index';
import { useExpandFields } from './hooks';

import cx from './createOrEditVersionModal.less';
export type DateValue = Dayjs | number | string | Date; // 兼容传入的类型为时间戳
// 获取当前日期的当天23点59分59秒的Date格式时间
export const getEndOfDayToDate = (date: DateValue): Date => {
  return dayjs(date).endOf('day').toDate();
};
const getContainer = () => document.body;
const { RangePicker } = DatePicker;
const componentsInit = (type: string) => {
  switch (type) {
    case 'Date':
      return DateCell;
    case 'Dropdown':
      return DropdownCell;
    case 'Text':
      return TextCell;
    case 'Radio':
      return Radio;
    case 'Number':
      return Number; // TODO: 从apps-team-components引入的number字段样式会丢失，暂时用重写的
    default:
      null;
  }
};
/*
 * 版本管理弹窗
 * */
const CreateOrEditVersionModal: React.FC<AddItemReleaseModalProps> = props => {
  const { title, visible, onClose, initialValue } = props;
  const { expandFields } = useExpandFields();

  const formikRef = useRef(null);
  const _initialValue = useMemo(() => {
    if (!initialValue) {
      return {
        range: [getEndOfDayToDate(dayjs()), getEndOfDayToDate(dayjs())],
      };
    }
    const valueInitCopy = {
      ...initialValue,
      range: [initialValue.startDate?.iso, initialValue.releaseDate?.iso],
    };

    if (!valueInitCopy?.expandFieldValues) {
      return {
        ...valueInitCopy,
        expandFieldValues: {},
      };
    }

    return valueInitCopy;
  }, [initialValue]);

  console.log(_initialValue, '_initialValue');

  const [confirmLoading, setConfirmLoading] = useState(false);

  const validate = async value => {
    const errors: FormError = {};
    if (!value.name || !value.name.trim()) {
      set(errors, 'name', `名称错误`);
    } else if (value.name.trim().length > 30) {
      set(errors, 'name', `长度有误`);
    }
    if (!value.range || !value.range.length) {
      set(errors, 'range', `必填`);
    }
    if (value.description && value.description.length > 200) {
      set(errors, 'description', `描述有误`);
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

  // const onSubmitForm = values => {
  //   console.log(values, 'values');
  //   // onSubmit(values, setConfirmLoading);
  // };
  const onSubmitForm = useCallback(
    value => {
      setConfirmLoading(true);
      const Workspace = Parse.Object.extend('Workspace');
      const workspaceValuePoint = Workspace.createWithoutData('mfOqDjmo3k');
      const { objectId, name, range = [], description, expandFieldValues } = value;
      // callback && callback(true);
      const Version = Parse.Object.extend('Version');
      const VersionObject = new Version({
        objectId: objectId,
        workspace: workspaceValuePoint,
        name: name.trim(),
        startDate: getEndOfDayToDate(dayjs(range[0])),
        releaseDate: getEndOfDayToDate(dayjs(range[1])),
        description: description,
        expandFieldValues: expandFieldValues,
      });
      VersionObject.save()
        .then(() => {
          console.log('逞能');
          setConfirmLoading(false);
          message.success('成功');
          // onClose?.();
          // setInitialValue({});
          // mutate();
        })
        .catch(e => {
          setConfirmLoading(false);
          message.error(e.message);
        })
        .finally(() => {
          // callback && callback(false);
        });
    },
    [onClose],
  );
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
          destroyOnClose
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
                  <CustomLabel label="版本名称" required />
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
                  <CustomLabel label="时间范围" required />
                  <RangePicker
                    {...rest}
                    value={value ? [dayjs(value[0]), dayjs(value[1])] : null}
                    onChange={date => {
                      setFieldValue('range', date ? date : null);
                    }}
                    getPopupContainer={getContainer}
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
                  <Input.TextArea {...field} placeholder="请输入描述" />
                </>
              );
            }}
          </FormField>
          <Row gutter={16}>
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
                apply: 'field',
                readonly: false,
                description: ele.property.fieldDesc,
                ...omit(ele.data, ['customData']),
                ...omit(ele.property, ['defaultValue']),
              };

              return (
                FieldComponent && (
                  <Col span={ele.fieldType.component === 'Text' ? 24 : 12}>
                    <FormField
                      name={`expandFieldValues.${ele.key}`}
                      required={ele.required}
                      key={ele.key}
                    >
                      {({ field }) => {
                        // 新建字段未赋值时field.value为undefined
                        const value = field.value === undefined ? commonData.value : field.value;
                        return (
                          <>
                            <div className={cx('custom-label')}>
                              {ele.required && <span className={cx('required')}>*</span>}
                              {ele.name}
                              {ele.property.fieldDesc ? (
                                <Tooltip title={ele.property.fieldDesc}>
                                  <QuestionCircleOutlined />
                                </Tooltip>
                              ) : null}
                            </div>

                            <FieldComponent
                              {...commonData}
                              {...field}
                              disabled={ele.readonly}
                              value={value}
                            />
                          </>
                        );
                      }}
                    </FormField>
                  </Col>
                )
              );
            })}
          </Row>
        </Modal>
      )}
    </Formik>
  );
};

export default CreateOrEditVersionModal;
