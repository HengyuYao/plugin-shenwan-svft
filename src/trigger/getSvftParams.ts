import { getData, getAllData, axios } from '@giteeteam/apps-team-api';
import { printLogs } from '../utils/util';
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

  try {
    const { versionId } = global?.body;
    printLogs(`接收到版本id ${versionId}, 开始处理`);
    
    if (versionId === undefined) {
      return {
        message: "未收到版本id",
        code: 400,
      };
    }

    printLogs(`查看版本 ${versionId} 的相关数据`);

    const versionParse = await getData(false, "Version", {
      objectId: versionId,
    });

    if (!versionParse) {
      return {
        message: "未找到对应版本",
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
        message: "版本所属空间未配置对应的系统清单",
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

    const softwareNumberFromVersion = version?.name?.split('_')?.[0];
    const Q26IykyN = Q26IykyN_Origin?.filter(it => it.Qh1TDv0z === softwareNumberFromVersion);

    if (!Q26IykyN?.length) {
      return {
        message: "未找到版本对应的应用编号或应用名称",
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

    // 组装参数
    return {
      code: 200,
      message: '参数查询成功',
      result: {
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
        Q26IykyN,
        Q1g6WPmQ,
      }
    }
    
  } catch (error) {
    return {
      message: error?.message,
      code: 500
    };
  }

};
