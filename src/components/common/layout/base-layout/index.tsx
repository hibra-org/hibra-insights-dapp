import React from 'react';
import { Layout as AntdLayout } from 'antd';
import ErrorsModal from '@components/common/modal/errors-modal';

const { Content } = AntdLayout;

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AntdLayout>
      <Content>
        {children}
        <ErrorsModal />
      </Content>
    </AntdLayout>
  );
}

export default Layout;
