import React from "react";
import { Layout } from "antd";
import { useLocation } from "react-router";
import {
  PayCircleOutlined,
  SettingOutlined,
  HomeOutlined,
} from "@ant-design/icons";

import styles from "./layouts.module.scss";
import { Link } from "react-router-dom";
const { Sider } = Layout;

function GlobalSider(props) {
  const { background } = props;
  const { pathname } = useLocation();

  const items = [
    {
      key: "courses",
      icon: <HomeOutlined />,
      label: "Dashboard",
      link: "/dashboard",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      link: "/settings",
    },
    {
      key: "billing",
      icon: <PayCircleOutlined />,
      label: "Billing",
      link: "/billings",
    },
    // {
    //   key: 'learn',
    //   icon: <ReadOutlined />,
    //   label: 'How to Use',
    //   link: '/learn'
    // }
  ];

  return (
    <Sider
      style={{
        background: background,
        zIndex: 1000,
      }}
      className={styles.sideNavWrapper}
      trigger={null}>
      <ul className={styles.memu}>
        {items.map((menu, i) => (
          <li key={menu.key} className={pathname.indexOf(menu.key) > -1 ? styles.active : ""} >
            <div className={styles.item}>
              <Link to={menu.link} className={styles.linkItem}>
                {menu.icon}
                <span className={styles.label}>{menu.label}</span>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </Sider>
  );
}

export default GlobalSider;
