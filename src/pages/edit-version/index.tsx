import React, { useCallback, useState } from 'react';
import { LibraryProvider } from '@giteeteam/apps-team-components';
import { Button } from 'antd';

import CreateOrEditVersionModal from '@/components/CreateOrEditVersionModal';

export const AddVersion: React.FC = () => {
  const initialValue = {
    createdAt: '2023-04-13T13:21:50.042Z',
    updatedAt: '2023-04-13T13:21:50.042Z',
    name: '123',
    workspace: { __type: 'Pointer', className: 'Workspace', objectId: 'mfOqDjmo3k' },
    description: 'rwrwrw',
    archived: false,
    released: false,
    createdBy: { __type: 'Pointer', className: '_User', objectId: 'jasPZZVVEQ' },
    startDate: { __type: 'Date', iso: '2023-04-13T15:59:59.999Z' },
    releaseDate: { __type: 'Date', iso: '2023-04-13T15:59:59.999Z' },
    programVersion: false,
    expandFieldValues: { Date: 1680537600000, Text: '1', Radio: '1', Number: 1, Dropdown: ['1'] },
    delay: false,
    objectId: 'amSpAC604F',
  };
  const [modalVisible, setModalVisible] = useState(false);
  const handleEdit = useCallback(() => {
    setModalVisible(true);
  }, []);
  return (
    // @ts-ignore
    <LibraryProvider workspaceKey="">
      <Button type="primary" onClick={handleEdit}>
        编辑版本
      </Button>
      {modalVisible ? (
        <CreateOrEditVersionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          initialValue={initialValue}
          title="编辑版本"
        />
      ) : null}
    </LibraryProvider>
  );
};

export default AddVersion;
