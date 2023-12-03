import React from 'react';
import { SEO } from '@/utils/constants/seo.constant';
import { Layout } from 'antd';

import styles from './copyright-footer.module.scss';

const { Footer } = Layout;

function CopyrightFooter() {
  return (
    <Footer className={styles.footer}>
      {SEO.title} &copy;{new Date().getFullYear()}
    </Footer>
  );
}

export default CopyrightFooter;
