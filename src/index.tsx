import ReactDOM from 'react-dom';
import { ProximaSDK } from '@projectproxima/plugin-sdk';

import App from './App';

import './index.global.less';
const rootElement = '#item-link-doc';

if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

function render(props) {
  const { container } = props;
  if (!container) {
    window.QiankunProps = {
      context: {
        // http://192.168.48.33/parse/api/items/qnNbbReVSZ?screen=view
        itemId: 'sC3F92OUVk',
        env: {
          TENANT_KEY: 'osc',
          GITEE_ONE_GATEWAY: '',
        },
      },
      frame: {
        app: {
          key: 'svft_app',
        },
      },
      sdk: {
        context: {
          env: {
            PROXIMA_APP_ID: 'proxima-core',
            PROXIMA_GATEWAY: process.env.REACT_APP_API_SERVER,
            sessionToken: JSON.parse(localStorage.getItem('Parse/proxima-core/currentUser'))
              ?.sessionToken,
          },
        },
        sendAction: () => new Promise<void>(() => {}),
      },
    };
  }

  ReactDOM.render(
    <App {...props} />,
    container ? container.querySelector(rootElement) : document.querySelector(rootElement),
  );
}

if (!window.__POWERED_BY_QIANKUN__) {
  const sdk = new ProximaSDK({ sdkServer: window.parent });
  render({ sdk });
}

export async function bootstrap(): Promise<void> {
  console.info('app bootstraped');
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function mount(props): Promise<void> {
  console.info('app mount ===>', props);

  window.QiankunProps = props;
  render(props);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function unmount(props): Promise<void> {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(
    container ? container.querySelector(rootElement) : document.querySelector(rootElement),
  );
}
