import React, { ReactNode } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Result } from 'antd';

function Access({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useDynamicContext();

  if (!isAuthenticated) {
    return <Result title="Please login to be continue" />;
  }
  return <div>{children}</div>;
}

export default Access;
