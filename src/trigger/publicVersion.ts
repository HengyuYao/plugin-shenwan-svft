import { getData, saveAllObject, axios } from '@giteeteam/apps-team-api';
import { printLogs } from '../utils/util';
export const publicVersion = async (): Promise<any> => {
  // 默认的类型 -> 终态流转配置
  const defaultConfig = (global?.env?.defaultConfig && JSON.parse(global?.env?.defaultConfig)) ?? [
    {
      itemType: '功能需求',
      itemTypeId: 'j3i4Pv96h6',
      targetStatusId: 'LbSG07dnFl',
    },
    {
      itemType: '产品需求',
      itemTypeId: 'MccwFD4zDe',
      targetStatusId: 'LbSG07dnFl',
    }
  ];

  // 针对不同空间的类型 -> 终态流转配置
  const workspaceConfig = ((global?.env?.workspaceConfig && JSON.parse(global?.env?.workspaceConfig)) || [])?.map(it => ({
    workspace: it.workspace,
    workspaceId: it.workspaceId,
    config: [ ...(defaultConfig || []), ...(it.config || []) ]
  })) ?? [{
    workspace: 'T-业务中台研发空间', 
    workspaceId: 'kIOb6tqOPr',
    config: defaultConfig
  }];

  printLogs(`空间流转规则配置`, { workspaceConfig, defaultConfig });

  try {
    const { versionIds } = global?.body;
    printLogs(`接收到版本id ${versionIds}, 开始处理`);
    
    if (!versionIds?.length) {
      return {
        message: "未收到版本id",
        code: 400,
      };
    }

    printLogs(`查看版本 ${versionIds} 的相关数据`);

    const versionsParseOrigin =  await Promise.all(versionIds.map(versionId => getData(false, "Version", {
      objectId: versionId,
    })));
    printLogs(`原始版本 ${versionIds} 查询成功`, versionsParseOrigin?.map(versionParse => versionParse?.toJSON()));

    const versionsParse = versionsParseOrigin?.filter(Boolean);
    printLogs(`版本 ${versionIds} 查询成功 长度：${!versionsParse?.length} `, versionsParse?.map(versionParse => versionParse?.toJSON()));

    if (!versionsParse?.length) {
      return {
        message: "未找到对应版本",
        code: 500,
      };
    }

    versionsParse?.forEach(versionParse => {
      versionParse?.set({
        released: true,
        releaseDate: {
          __type: 'Date',
          iso: new Date().toISOString(),
        },
      })
  });

    await saveAllObject(versionsParse);

    printLogs(`版本 ${versionIds} 发布成功`, versionsParse?.map(versionParse => versionParse?.toJSON()));
    
    // 流转版本下的事项状态
    Promise.all(versionsParse.map(versionParse => {
      const version = versionParse?.toJSON() ?? {};
      const params = { config: workspaceConfig?.find(it => it.workspaceId === version?.workspace?.objectId)?.config || defaultConfig, versionId: version?.objectId };
      printLogs(`自动化流转事项状态 ${version?.objectId} `, params);
      axios({
        method: 'POST',
        url: 'http://gitee-proxima-atm:5678/webhook/publicVersion',
        data: {
          params
        }
      })
    }));

    // 组装参数
    return {
      code: 200,
      message: '成功',
    }
    
  } catch (error) {
    return {
      message: error?.message,
      code: 500
    };
  }

};
