const getExternalsObjectPath = () => moduleName => ['window modules', moduleName];

const getCommonExternals = () => {
  const getCommonExternalPath = getExternalsObjectPath('common');
  return {
    'react-dom': getCommonExternalPath('reactDOM'),
    react: getCommonExternalPath('react'),
    axios: getCommonExternalPath('axios'),
    antd: getCommonExternalPath('antd'),
    debug: getCommonExternalPath('debug'),
    classnames: getCommonExternalPath('classnames'),
    lodash: getCommonExternalPath('lodash'),
    parse: getCommonExternalPath('parse'),
    'lodash/fp': getCommonExternalPath('lodashFP'),
  };
};

const getExtraExternals = () => {
  const getExtraExternalPath = getExternalsObjectPath('extra');
  return {
    echarts: getExtraExternalPath('echarts'),
    formik: getExtraExternalPath('formik'),
    '@udecode/plate': getExtraExternalPath('plate'),
    codemirror: getExtraExternalPath('codemirror'),
  };
};

module.exports = {
  getCommonExternals,
  getExtraExternals,
};
