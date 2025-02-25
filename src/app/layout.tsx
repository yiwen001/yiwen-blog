"use client"
 
import { Inter } from "next/font/google";
import "./globals.css";
import React, { useState } from 'react';
import { Menu } from 'antd';
import { useRouter } from 'next/navigation';
import styles from './layout.module.sass';
import dynamic from 'next/dynamic';
import SphereEffect from './components/SphereEffect';
 

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}:  {
  children: React.ReactNode
}) {
  const router = useRouter();
  
 

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.backgroundShape}>
         <SphereEffect/>
        </div>
        <main className={styles.mainContent}>
          {children}
        </main>
      </body>
    </html>
  )
}
