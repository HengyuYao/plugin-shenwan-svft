import type ParseType from 'parse';

const getGateway = (): string => {
  const { QiankunProps, env } = window as any;
  return QiankunProps?.context?.env?.PROXIMA_GATEWAY ?? env.PROXIMA_GATEWAY;
};

const getAppIdd = (): string => {
  const { QiankunProps, env } = window as any;
  return QiankunProps?.context?.env?.PROXIMA_APP_ID ?? env.PROXIMA_APP_ID;
};

let Parse: typeof ParseType;

if (window.QiankunProps?.Parse) {
  Parse = window.QiankunProps?.Parse;
} else {
  Parse = require('parse');
  const PROXIMA_GATEWAY = getGateway();
  const PROXIMA_APP_ID = getAppIdd();
  Parse.serverURL = `${PROXIMA_GATEWAY}/parse`;
  Parse.initialize(PROXIMA_APP_ID);
}

export default Parse;
