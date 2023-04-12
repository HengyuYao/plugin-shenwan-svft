import React, { useCallback, useState } from 'react';
import { Button } from 'antd';

import CreateOrEditVersionModal from '@/components/CreateOrEditVersionModal';
export const AddVersion: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const handleEdit = useCallback(() => {
    setModalVisible(true);
  }, []);
  return (
    <>
      <Button type="primary" onClick={handleEdit}>
        新建版本
      </Button>
      ;{modalVisible ? <CreateOrEditVersionModal visible={modalVisible} /> : null}
    </>
  );
};

export default AddVersion;
