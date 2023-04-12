import React, { Suspense, useEffect, useMemo } from "react";
import {
  HashRouter,
  MemoryRouter,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { PluginSDKContext } from "@projectproxima/plugin-sdk";
import { ConfigProvider, message } from "antd";
import antdLangZhCN from "antd/lib/locale/zh_CN";
const rootElement = "item-link-doc";

message.config({
  getContainer: () =>
    document.getElementById("osc-proxima") ||
    document.getElementById(rootElement),
});

import routes from "./routes";

interface QiankunContextProps {
  setGlobalState?: (data: { data: any }) => void;
  Parse?: any;
  onRefreshContext?: any;
}

export const QiankunContext = React.createContext({} as QiankunContextProps);

const GoPropsRoute = (props) => {
  const history = useHistory();

  useEffect(() => {
    console.info("子应用接收route:", props?.route);
    // 跳转渲染指定的路由
    if (props?.route) {
      history.push(props?.route);
    }
  }, []);

  return null;
};

const App: React.FC = (props) => {
  const qiankunContextValue: any = useMemo(
    () => ({
      ...props,
    }),
    [props]
  );
  return (
    <PluginSDKContext.Provider value={qiankunContextValue.sdk}>
      <ConfigProvider
        getPopupContainer={() => document.getElementById(rootElement)}
        locale={antdLangZhCN}
      >
        {process.env.NODE_ENV === "production" ? (
          <MemoryRouter>
            <GoPropsRoute {...props} />
            <Switch>
              <Suspense fallback={<div>Loading...</div>}>
                {routes.map(({ path, component, exact }) => (
                  <Route
                    path={path}
                    component={component}
                    exact={exact}
                    key={path}
                  />
                ))}
              </Suspense>
            </Switch>
          </MemoryRouter>
        ) : (
          <HashRouter>
            <Switch>
              <Suspense fallback={<div>Loading...</div>}>
                {routes.map(({ path, component, exact }) => (
                  <Route
                    path={path}
                    component={component}
                    exact={exact}
                    key={path}
                  />
                ))}
              </Suspense>
            </Switch>
          </HashRouter>
        )}
      </ConfigProvider>
    </PluginSDKContext.Provider>
  );
};

export default App;
