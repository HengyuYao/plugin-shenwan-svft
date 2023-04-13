import { useEffect, useState } from 'react';

import Parse from '@/lib/parse';

// 获取后台配置的版本拓展字段，用于app、项目集新建版本
export const useExpandFields = (): { expandFields: any[] } => {
  const [expandFields, setExpandFields] = useState([]);
  useEffect(() => {
    const getVersionExpandFields = async () => {
      const VersionExpandFieldQueryObject = new Parse.Query('VersionExpandField')
        .include('fieldType')
        .addDescending('createdAt')
        .notEqualTo('hidden', true);
      // @ts-ignore
      const fields = await VersionExpandFieldQueryObject.find({ json: true });
      setExpandFields(fields);
    };
    getVersionExpandFields();
  }, []);
  return {
    expandFields,
  };
};
