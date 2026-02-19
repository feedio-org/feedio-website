import React from 'react';
import { Outlet } from "react-router-dom";
import { Layout } from 'antd';

import GlobalHeader from './header';
import styles from './layouts.module.scss';
import GlobalSider from './sidenav';
const { Content } = Layout;

function VaLayout(props) {

  return (
    <Layout className={styles.wrapper}>
      <GlobalHeader  />
      <Layout  className={styles.sectionLayout}>
        <GlobalSider  />

        <Layout style={{
          marginLeft: 70,
          transition: ' transform 0.3s'
        }} className={`${styles.card}`}>
          <Content
            style={{
              transition: ' transform 0.3s',
              margin: 0
            }}
          >
            <Outlet/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default VaLayout;