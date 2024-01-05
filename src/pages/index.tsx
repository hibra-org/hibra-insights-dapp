/* eslint-disable import/no-unused-modules */
import GetStart from '@/components/common/getStart';
import Header from '@/components/common/header';
import Layout from '@/components/common/layout/base-layout';
import { Watermark } from 'antd';
import { DefaultSeo } from 'next-seo';
import { SEO } from '@utils/constants/seo.constant';

const Home = () => {
  return (
    <div style={{ backgroundColor: '#000000' }}>
      <DefaultSeo {...SEO} title="Home" />
      <Watermark content="duongnamtruong.com"></Watermark>
      <div style={{ marginBottom: '40px' }}>
        <Header></Header>
      </div>
      <GetStart></GetStart>
    </div>
  );
};

export default Home;

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
