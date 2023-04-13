export type BaseFieldProps = {
  required?: boolean;
  width?: number;
  label?: string;
  value?: number;
  description?: string;
  onChange?: (data: number) => void;
  onBlur?: (e: any) => void;
  descPlacement?: string;
  defaultValue?: number;
  placeholder?: string;
  addonBefore?: string; // 前缀
  addonAfter?: string; // 后缀
  max?: number;
  min?: number;
  step?: number;
  precision?: number; // 精度
  type?: string; // int或float
  searchComponent?: boolean;
  disabled?: boolean;
};
export interface FieldProps {
  editMode?: boolean;
  name?: string;
  labelAlign?: 'left' | 'right' | 'top'; // 标签对齐方式
  labelWidth?: number; // 标签宽度
  hiddenLabel?: boolean;
  readonly?: boolean;
  apply?: string;
  userData?: Record<string, any>;
  searchComponent?: boolean;
  allowNull?: boolean;
  isGroup?: boolean;
}
