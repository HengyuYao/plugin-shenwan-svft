import React from "react";
import { useSDK } from "@projectproxima/plugin-sdk";
export const CopyVersion: React.FC = () => {
  const {
    row,
    workspaceKey,
    env: { TENANT_KEY, GITEE_ONE_GATEWAY },
  } = useSDK()?.context || window.QiankunProps?.context || {};
  const url = `${GITEE_ONE_GATEWAY}/${TENANT_KEY}/${workspaceKey}/integrated-delivery/new?versionId=${row?.objectId}`;

  return <span onClick={() => window.open(url)}>创建集成交付版本</span>;
};

export default CopyVersion;
