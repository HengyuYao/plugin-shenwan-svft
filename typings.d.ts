declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}
declare interface Window {
  __POWERED_BY_QIANKUN__: boolean;
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__: string;
  QiankunProps: any;
  sdk: {
    context: {
      row: any[];
      env: {
        GITEE_ONE_GATEWAY: string;
        TENANT_KEY: string;
        WORKSPACE_KEY: string;
        sessionToken: string;
        LOCALES: string;
      };
      itemId: string;
    };
  };
}
declare let __webpack_public_path__: string;
