/* eslint-disable import/no-unused-modules */
import React from 'react';
import AdminLayout from '@/components/common/layout/admin-layout';
import Layout from '@/components/common/layout/base-layout';
import { DefaultSeo } from 'next-seo';
import { SEO } from '@utils/constants/seo.constant';

const Overview = () => {
  return (
    <>
      <DefaultSeo {...SEO} title="Overview" />

      {
        // indicates very long content
        Array.from({ length: 100 }, (_, index) => (
          <React.Fragment key={index}>
            {index % 20 === 0 && index ? 'more' : '...'}
            <br />
          </React.Fragment>
        ))
      }
    </>
  );
};

export default Overview;

Overview.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      <AdminLayout>{page}</AdminLayout>
    </Layout>
  );
};
