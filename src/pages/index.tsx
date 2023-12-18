/* eslint-disable import/no-unused-modules */
import Layout from '@/components/common/layout/base-layout';
import { Watermark } from 'antd';
import { DefaultSeo } from 'next-seo';
import { SEO } from '@utils/constants/seo.constant';

const Home = () => {
  return (
    <>
      <DefaultSeo {...SEO} title="Home" />
      <Watermark content="duongnamtruong.com"></Watermark>
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
