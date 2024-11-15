"use client";
import React from 'react';
import styles from './page.module.sass';
import Circle from '@/app/components/circle';
 
export default function AboutPage() {
 

  return (
    <div className={styles.aboutSection}>
      <div className={styles.secondMain}>
        <div className={styles.secondNav}>
          <div>About Me</div>
         
        </div>
        <div className={styles.intro}>
          <div>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
            Hi! I'm Yiwen, a Front-end Web Developer based in Shaoxing, China. Having recently completed my Master's in Computer Engineering from NYU in 2023, I now apply my skills at a distinguished university's institute. Here, I'm actively engaged in a significant project—a Virtual Power Plant (VPP) platform, which serves as a cutting-edge solution for smart energy resource management. My responsibilities span the entire development lifecycle, from design to deployment, bolstered by the automation of our deployment process for optimized testing efficiency and reliability.
          </div>
          <div className={styles.intro2}>
            <div style={{ width: '700px' }}>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
              My technical arsenal includes JavaScript/TypeScript, React, Umi, Node.js, Next.js, and Nginx. I'm well-versed in utilizing data visualization tools and UI libraries like ECharts, Ant Design (antd), and Chakra UI, with proven experience in managing large datasets on the front-end.
            </div>
            <div className={styles.avatar}><Circle/></div>
          </div>
        </div>
      </div>
    </div>
  );
}