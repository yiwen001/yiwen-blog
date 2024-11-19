"use client"
 
import { Inter } from "next/font/google";
import "./globals.css";
import React, { useState } from 'react';
import { Menu } from 'antd';
import { useRouter } from 'next/navigation';
import styles from './layout.module.sass'; // 确保你创建了这个 CSS 模块
const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}:  {
  children: React.ReactNode
}) {
  const router = useRouter();
  
  const handleMenuClick = (e: any) => {
    if (e.key === 'home') {
      router.push('/');
    } else if (e.key === 'resume') {
      router.push('/resume');
    } else if (e.key === 'projects') {
      router.push('/projects');
    }
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        
        <main className={styles.mainContent}>
          {children}
        </main>
      </body>
    </html>
  )
}
