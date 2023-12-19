/* eslint-disable import/no-unused-modules */
import React from 'react';
import AdminLayout from '@/components/common/layout/admin-layout';
import Layout from '@/components/common/layout/base-layout';
import PortfolioSetting from '@/components/features/setting/portfolio';
import { DefaultSeo } from 'next-seo';
import { SEO } from '@utils/constants/seo.constant';

const Setting = () => {
  return (
    <>
      <DefaultSeo {...SEO} title="Setting" />
      <PortfolioSetting />
    </>
  );
};

export default Setting;

Setting.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      <AdminLayout>{page}</AdminLayout>
    </Layout>
  );
};
