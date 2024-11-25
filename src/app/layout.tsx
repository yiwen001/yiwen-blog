"use client"
 
import { Inter } from "next/font/google";
import "./globals.css";
import React, { useState } from 'react';
import { Menu } from 'antd';
import { useRouter } from 'next/navigation';
import styles from './layout.module.sass';
import dynamic from 'next/dynamic';

const DynamicSphere = dynamic(() => import('./components/SphereEffect'), { ssr: false });

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
        <div className={styles.backgroundShape}>
          <DynamicSphere />
        </div>
        <main className={styles.mainContent}>
          {children}
        </main>
      </body>
    </html>
  )
}
