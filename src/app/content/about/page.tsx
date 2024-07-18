"use client";
import React, { useState } from 'react';
import styles from './page.module.sass';
import { Dropdown, Menu } from 'antd';
import { useRouter } from 'next/navigation';
export default function AboutPage() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };
 
  const handleMenuClick = (e) => {
    if (e.key === 'home') {
      router.push('/');
    }
  };
  const menu = (
    <Menu   
    onClick={handleMenuClick}
     className={styles.customMenu}>
      <Menu.Item key="home" className={styles.menuItem}>Home</Menu.Item>
      <Menu.Item key="resume" className={styles.menuItem}>Resume</Menu.Item>
      <Menu.Item key="blog" className={styles.menuItem}>Blog</Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.aboutSection}>
      <div className={styles.secondMain}>
        <div className={styles.secondNav}>
          <div>About Me</div>
          <Dropdown 
            overlay={menu} 
            trigger={['click']} 
            visible={visible} 
            onVisibleChange={handleVisibleChange}>
            <div 
              className={styles.icon} 
              id={styles.menu} 
              onClick={() => setVisible(!visible)}>
            </div>
          </Dropdown>
        </div>
        <div className={styles.intro}>
          <div>
            Hi! I'm XXX, a Front-end Web Developer based in Shaoxing, China. Having recently completed my Master's in Computer Engineering from NYU in 2023, I now apply my skills at a distinguished university's institute. Here, I'm actively engaged in a significant project—a Virtual Power Plant (VPP) platform, which serves as a cutting-edge solution for smart energy resource management. My responsibilities span the entire development lifecycle, from design to deployment, bolstered by the automation of our deployment process for optimized testing efficiency and reliability.
          </div>
          <div className={styles.intro2}>
            <div style={{ width: '700px' }}>
              My technical arsenal includes JavaScript/TypeScript, React, Umi, Node.js, Next.js, and Nginx. I'm well-versed in utilizing data visualization tools and UI libraries like ECharts, Ant Design (antd), and Chakra UI, with proven experience in managing large datasets on the front-end.
            </div>
            <div className={styles.avatar}></div>
          </div>
        </div>
      </div>
    </div>
  );
}