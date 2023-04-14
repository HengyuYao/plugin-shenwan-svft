import { getData, getAllData, axios } from '@giteeteam/apps-team-api';
import { formate, printLogs } from '../utils/util';
export const getSvftParams = async (): Promise<any> => {
  const bindWorkspaceKey = global?.env?.bindWorkspaceKey ?? 'BindWorkspace1'
  const itemTypeId = global?.env?.itemTypeId ?? 'BKFuaOq5Sg'
  const softwareNumber = global?.env?.softwareNumberKey ?? 'yingyongbianhao'
  const softwareName = global?.env?.softwareNameKey ?? 'yingyongmingcheng'
  const Userpm = global?.env?.UserpmKey ?? 'Userpm'
  const mode = global?.env?.mode ?? 'product'
  const basicAuth = global?.env?.basicAuth ?? 'Basic dXNlcjoxMjM0NDQ='
  const svftUrl = global?.env?.svftUrl ?? 'http://192.168.152.116:8091/api/v1/systems/svft/softwares'
  const secondDepartmentMap = global?.env?.secondDepartmentMap ?? {
    "信息技术保障总部-运行保障二部": "102307",
    "信息技术保障总部-运行保障三部": "102737",
    "default": "001219"
  }

  const fieldMap = global?.env?.fieldMap ?? {
    number: [],
    text: [],
    downDrop: [],
    date: []
  }



  try {
    printLogs(`接收到版本id, 开始处理`, fieldMap);
    const { versionIds } = global?.body;
    printLogs(`接收到版本id, 开始处理`, versionIds);
    
    if (!versionIds?.length) {
      return {
        message: "未收到版本id",
        code: 500,
      };
    }

    const ps = await versionIds?.map(async versionId => {
      printLogs(`查看版本 ${versionId} 的相关数据`);

      const versionParse = await getData(false, "Version", {
        objectId: versionId,
      });
  
      if (!versionParse) {
        return {
          message: `${versionId}未找到对应版本`,
          code: 500,
        };
      }
  
      const version = versionParse.toJSON();
  
      printLogs(`版本 ${versionId} 数据查询完毕，数据为`, version);
  
      const systemParses = await getAllData(false, "Item", {
        [`values.${bindWorkspaceKey}`]: version?.workspace?.objectId,
        itemType: itemTypeId,
      });
  
      printLogs(`对应的系统清单数据查询完毕，数据为`, systemParses?.map(system => (system?.toJSON())));
  
      if (!systemParses?.length) {
        return {
          message: `${versionId}版本所属空间未配置对应的系统清单`,
          code: 500,
        };
      }
  
      // 获取应用系统名称
      const Q26IykyN_Origin = [];
      let Qb0lCJdN = null;
      let Q1g6WPmQ = null;
  
      systemParses?.forEach(system => {
        const values = system?.toJSON()?.values ?? {};
        const softwareNumberValue = values?.[softwareNumber];
        const softwareNameValue = values?.[softwareName];
        const UserpmValue = values?.[Userpm]?.[0]?.username;
        const secondDepartment = values?.SecondDepartment;
  
  
  
        if (softwareNumberValue && softwareNameValue) {
          Q26IykyN_Origin.push({
            id: 'Qh1TDv0z',
            Qh1TDv0z: softwareNumberValue,
            Qy906QIJ: softwareNameValue,
          });
        }
        if (UserpmValue && !Qb0lCJdN) {
          Qb0lCJdN = UserpmValue;
        }
  
        if (secondDepartment && !Q1g6WPmQ) {
          Q1g6WPmQ = secondDepartmentMap?.[secondDepartment] ?? secondDepartmentMap.default;
        }
      });
  
      printLogs(`获取全量应用系统名称完毕，数据为`, Q26IykyN_Origin);
  
      const softwareNumberFromVersion = version?.expandFieldValues?.softwareName?.[0];
      const Q26IykyN = Q26IykyN_Origin?.filter(it => it.Qh1TDv0z === softwareNumberFromVersion);
  
      if (!Q26IykyN?.length) {
        return {
          message: `${versionId}未找到版本对应的应用编号或应用名称`,
          code: 500,
        };
      }
  
      let result = null;
      if (mode === 'product') {
        // 获取产品经理作为变更人
        const headers = {
          "Content-Type": 'application/json',
          "Authorization": `${basicAuth}`
        }
  
        const params = {
          pageNumber: 1,
          pageSize: 10,
          keyword: "",
          conditions: [
            {
              id: "Qh1TDv0z",
              op: "EQ",
              value: Q26IykyN?.[0]?.Qh1TDv0z
            }
          ],
          sort: {
            field: "id"
          }
        }
        printLogs(`请求路由`, svftUrl);
        printLogs(`请求参数`, params);
        printLogs(`请求头`, headers);
  
        result = await axios({
          method: 'POST',
          url: 'http://gitee-proxima-atm:5678/webhook/getSvft',
          data: {
            svftUrl,
            params,
          }
        });
      }
  
      Qb0lCJdN = result?.data?.list?.[0]?.QnB6HauG?.[0]?.text ?? Qb0lCJdN;
  
      printLogs(`获取应用产品经理，数据为`, Qb0lCJdN);
      const data = {
        Qb0lCJdN, // 变更申请人
        QrNvhrjd: {
          account: Qb0lCJdN // 申请人部门
        },
        QMTjh0ds: {
          account: Qb0lCJdN // 申请人电话
        },
        QQrucNGX: version?.name ?? '', // 摘要
        Q0aIf7ed: version?.description ?? '',
        QMlbxfny: version?.description ?? '',
        Q26IykyN, // 应用编号
        Q1g6WPmQ: Q1g6WPmQ ?? secondDepartmentMap.default,
      }

      for (const key of Object.keys(fieldMap)) {
        const fields = fieldMap[key]?.filter(Boolean);
        printLogs(`定义的fieldMap key:`, fields);
        switch(key) {
          case 'date': 
            for (const field of fields) {
              data[field] = (version.expandFieldValues?.[field] && formate(version.expandFieldValues?.[field])) ?? '';
            }
            break;
          case 'downDrop': 
            for (const field of fields) {
              data[field] = version.expandFieldValues?.[field]?.join(',') ?? '';
            }
            break;
          case 'text': 
          case 'number':
            for (const field of fields) {
              data[field] = version.expandFieldValues?.[field] ?? '';
            }
            break;
        }
      }
  
      // 组装参数
      return {
        master: version.expandFieldValues?.master?.[0] === '1',
        createdAt: new Date(version?.createdAt).getTime(),
        versionId,
        code: 200,
        message: '参数查询成功',
        data
      }
    })

    const result = await Promise.all(ps);

    printLogs(`查询版本数据， 结果为`, result);

    const resultPatchData = result?.filter(it => it?.code === 200 && !!it?.data && !it?.master)?.filter(Boolean)?.sort((a, b) => b.createdAt - a.createdAt);
    printLogs(`查询patch版本数据， 结果为`, resultPatchData);
    const resultMasterData = result?.filter(it => it?.code === 200 && !!it?.data && it?.master)?.filter(Boolean)?.sort((a, b) => b.createdAt - a.createdAt);
    printLogs(`查询master版本数据， 结果为`, resultMasterData);

    let resultData = {};

    if (resultMasterData?.length) {
      resultData = resultMasterData?.[0]?.data ?? {};
    } else {
      resultData = resultPatchData?.[0]?.data ?? {};
    }

    if (resultPatchData?.length) {
      resultData['Q35P02gZ'] = resultPatchData?.[0]?.data?.Q35P02gZ;
    }

    printLogs(`查询版本数据， 结果为`, resultData);

    return {
      code: 200,
      message: '参数查询成功',
      result: resultData,
    }
    
  } catch (error) {
    return {
      message: error?.message,
      code: 500
    };
  }

};
