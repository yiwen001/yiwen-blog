"use client"
 
import { Inter } from "next/font/google";
import "./globals.css";
import React, { useState } from 'react';
import { Dropdown, Menu } from 'antd';
import { useRouter } from 'next/navigation';
import styles from './layout.module.sass'; // 确保你创建了这个 CSS 模块
const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}:  {
  children: React.ReactNode
}) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };
  const handleMenuClick = (e: any) => {
    if (e.key === 'home') {
      router.push('/');
    } else if (e.key === 'resume') {
      // 处理简历导航
      router.push('/resume');
    } else if (e.key === 'projects') {
      // 处理项目导航
      router.push('/projects');
    }
  };
  const menu = (
    <Menu   
    onClick={handleMenuClick}
     className={styles.customMenu}>
      <Menu.Item key="home" className={styles.menuItem}>Home</Menu.Item>
      <Menu.Item key="resume" className={styles.menuItem}>Resume</Menu.Item>
      <Menu.Item key="projects" className={styles.menuItem}>Projects</Menu.Item>
    </Menu>
  );
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.fixedMenu}>
          <Dropdown overlay={menu} trigger={['click']} visible={visible} onVisibleChange={handleVisibleChange}>
            <div className={styles.icon} id={styles.menu} onClick={() => setVisible(!visible)}></div>
          </Dropdown>
        </div>
        <main className={styles.mainContent}>
          {children}
        </main>
      </body>
    </html>
  )
}
