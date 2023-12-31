import React from 'react';
import Link from 'next/link';
import {
  PieChartOutlined,
  PushpinOutlined,
  RadarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';

import { WEB_ROUTES } from './routes.constant';

const NO_IMAGE = '/common/no-avatar.png';

const MENU_ITEMS = [
  {
    key: String(1),
    icon: React.createElement(RadarChartOutlined),
    label: <Link href={WEB_ROUTES.OVERVIEW}>Overview</Link>,
    path: WEB_ROUTES.OVERVIEW,
  },
  {
    type: 'divider',
  },
  {
    key: String(2),
    icon: React.createElement(PieChartOutlined),
    label: <Link href={WEB_ROUTES.PORTFOLIO}>Portfolio</Link>,
    path: WEB_ROUTES.PORTFOLIO,
    private: 'true',
  },
  {
    type: 'divider',
  },
  {
    key: String(3),
    icon: React.createElement(SettingOutlined),
    label: 'Setting',
    private: 'true',
    children: [
      {
        key: String(4),
        icon: React.createElement(PushpinOutlined),
        label: <Link href={WEB_ROUTES.SETTING + '#portfolio'}>Portfolio</Link>,
        path: WEB_ROUTES.SETTING + '#portfolio',
      },
    ],
  },
] as {
  path?: string;
  key: string;
  children?: { path?: string; key: string }[] & MenuProps['items'];
  private?: 'true';
}[] &
  MenuProps['items'];

export { NO_IMAGE, MENU_ITEMS };
