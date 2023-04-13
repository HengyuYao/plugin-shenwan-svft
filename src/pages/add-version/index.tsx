import React, { useCallback, useState } from 'react';
import { LibraryProvider } from '@giteeteam/apps-team-components';
import { Button } from 'antd';

import CreateOrEditVersionModal from '@/components/CreateOrEditVersionModal';

export const AddVersion: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const handleEdit = useCallback(() => {
    setModalVisible(true);
  }, []);

  const onClose = useCallback(() => {
    setModalVisible(false);
  }, []);
  return (
    // @ts-ignore
    <LibraryProvider workspaceKey="">
      <Button type="primary" onClick={handleEdit}>
        新建版本
      </Button>
      {modalVisible ? (
        <CreateOrEditVersionModal visible={modalVisible} onClose={onClose} title="新建版本" />
      ) : null}
    </LibraryProvider>
  );
};

export default AddVersion;
