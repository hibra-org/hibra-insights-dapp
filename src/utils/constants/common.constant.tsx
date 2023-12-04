import React from 'react';
import Link from 'next/link';
import { PieChartOutlined, RadarChartOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd';

import { rgbDataURL } from '../helpers/common';

const API_ROUTES = {
  GET_TASKS: '/api/get-tasks',
};

const WEB_ROUTES = {
  HOME: '/',
  OVERVIEW: '/overview',
  PORTFOLIO: '/portfolio',
};

const NO_IMAGE = '/common/no-avatar.png';
const PLACEHOLDER_IMAGE = rgbDataURL(204, 204, 204) as 'data:image/${string}';

const ACCESS_TOKEN_COOKIE_CONFIG = {
  maxAge: 60 * 5,
  httpOnly: false,
  secure: process.env.NEXT_PUBLIC_MODE_ENV !== 'development',
  sameSite: 'lax' as 'lax',
};

const REFRESH_TOKEN_COOKIE_CONFIG = {
  maxAge: 60 * 60 * 24 * 7,
  httpOnly: false,
  secure: process.env.NEXT_PUBLIC_MODE_ENV !== 'development',
  sameSite: 'lax' as 'lax',
};

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
  },
  {
    type: 'divider',
  },
] as { path?: string; key: string }[] & MenuProps['items'];

// eslint-disable-next-line no-unused-vars
enum COOKIE_KEYS {
  // eslint-disable-next-line no-unused-vars
  AUTH = 'auth',
}

const SALT = 10;

export {
  API_ROUTES,
  WEB_ROUTES,
  NO_IMAGE,
  ACCESS_TOKEN_COOKIE_CONFIG,
  REFRESH_TOKEN_COOKIE_CONFIG,
  MENU_ITEMS,
  PLACEHOLDER_IMAGE,
  COOKIE_KEYS,
  SALT,
};
