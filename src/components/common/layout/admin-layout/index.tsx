import React, { ReactNode, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LoginFeature from '@/components/features/login';
import { WEB_ROUTES } from '@/utils/constants';
import { MENU_ITEMS } from '@/utils/constants/common.constant';
import {
  PLACEHOLDER_IMAGE,
  toCapitalizeFirstLetter,
} from '@/utils/helpers/common.helper';
import { HomeOutlined } from '@ant-design/icons';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Breadcrumb, Flex, Layout, Menu, theme } from 'antd';
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import CopyrightFooter from '@components/common/footer/copyright-footer';

import AnimateLayout from '../animate-layout';
import styles from './admin-layout.module.scss';

const { Sider, Header, Content } = Layout;

function AdminLayout({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { isAuthenticated } = useDynamicContext();

  const router = useRouter();
  const pathName = router?.pathname;
  const asPath = router?.asPath;

  const menuPermissions = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (isAuthenticated) {
        return item;
      }
      return item.private !== 'true';
    });
  }, [isAuthenticated]);

  const menuSelected = useMemo(() => {
    let selected = null as any;

    for (const parent of menuPermissions) {
      if (parent?.children) {
        for (const child of parent.children) {
          if (
            [child?.path].includes(pathName) ||
            [child?.path].includes(asPath)
          ) {
            selected = child;
            break;
          }
        }
      }

      if (
        [parent?.path].includes(pathName) ||
        [parent?.path].includes(asPath)
      ) {
        selected = parent;
        break;
      }
    }

    return selected;
  }, [asPath, menuPermissions, pathName]);

  const breadcrumbItems = useMemo(
    () =>
      pathName.split('/').map(
        (path, index, arr): BreadcrumbItemType =>
          arr.length - 1 === index
            ? {
                title:
                  index === 0 ? (
                    <>
                      <HomeOutlined /> Home
                    </>
                  ) : (
                    toCapitalizeFirstLetter(path)
                  ),
              }
            : {
                href: index === 0 ? WEB_ROUTES.HOME : `/${path}`,
                title:
                  index === 0 ? (
                    <>
                      <HomeOutlined /> Home
                    </>
                  ) : (
                    toCapitalizeFirstLetter(path)
                  ),
              },
      ),
    [pathName],
  );

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed) => {
          setIsMobile(collapsed);
        }}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        <Link href={WEB_ROUTES.HOME}>
          <div className={styles.logo}>
            <Image
              src="/common/logo-dark.png"
              alt="logo"
              width={1678}
              height={472}
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
              draggable={false}
              placeholder={PLACEHOLDER_IMAGE}
              priority
            />
          </div>
        </Link>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={menuSelected ? [menuSelected.key] : []}
          items={menuPermissions}
        />
      </Sider>
      <Layout className={styles.layout}>
        <Header
          className={styles.header}
          style={{
            background: colorBgContainer,
          }}
        >
          {isMobile && (
            <>
              <Link href={WEB_ROUTES.HOME}>
                <div className={styles.mobileLogo}>
                  <Image
                    src="/common/logo-mobile.png"
                    alt="logo"
                    fill
                    style={{
                      objectFit: 'contain',
                    }}
                    sizes="40px"
                    draggable={false}
                    placeholder={PLACEHOLDER_IMAGE}
                    priority
                  />
                </div>
              </Link>

              <Menu
                className={styles.menu}
                mode="horizontal"
                selectedKeys={menuSelected ? [menuSelected.key] : []}
                items={menuPermissions}
              />
            </>
          )}
          <Flex justify="flex-end" style={isMobile ? {} : { width: '100%' }}>
            <LoginFeature />
          </Flex>
        </Header>

        <Content className={styles.content}>
          <Breadcrumb items={breadcrumbItems} />
          <AnimateLayout>
            <div
              style={{
                marginTop: 24,
                padding: 24,
                textAlign: 'center',
                background: colorBgContainer,
              }}
            >
              {children}
            </div>
          </AnimateLayout>
        </Content>
        <CopyrightFooter />
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
