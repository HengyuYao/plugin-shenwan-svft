// FieldType字段映射, 对应FieldType表的key字段
export const FIELD_TYPE_KEY_MAPPINGS = {
  // FieldType的custom field
  Text: 'Text', // 文本

  Number: 'Number', // 数值 -> number
  Dropdown: 'Dropdown', // 下拉组件 -> list
  Date: 'Date', // 日期 -> date
};

// 新建版本时可选择拓展字段的字段类型
export const INCLUDE_VERSION_EXPAND_FIELD_TYPES = [
  FIELD_TYPE_KEY_MAPPINGS.Text,
  FIELD_TYPE_KEY_MAPPINGS.Dropdown,
  FIELD_TYPE_KEY_MAPPINGS.Date,
  FIELD_TYPE_KEY_MAPPINGS.Number,
];
