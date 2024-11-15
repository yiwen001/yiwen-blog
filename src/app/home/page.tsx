"use client";
import styles from "./page.module.sass";
import { Button } from "@nextui-org/button";
import { useRouter } from 'next/navigation';
import React from 'react';
import FluidEffect from '../components/anime/fluid';
import Circle from "../components/circle";
import dynamic from 'next/dynamic';

const DynamicShape = dynamic(() => import('../components/DynamicShape'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const handleClick = () => {
    router.push('/about');
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.mainline}>
            <div className={styles.textWrapper}>
                         Hi, I am Yiwen
            </div>
            <div className={styles.circle}>
              <DynamicShape />
            </div>
          </div>
          <Button className={styles.customButton} onClick={handleClick}>
            About me 👋
          </Button>
        </div>
        <div className={styles.footer}>
          <a href="https://github.com/yiwen001" target="_blank">
            <div className={styles.icon} id={styles.github}></div>
          </a>
          <a href="https://www.linkedin.com/in/yiwen-gao-ab5580220/" target="_blank">
            <div className={styles.icon} id={styles.linkedin}></div>
          </a>
          <a href="https://medium.com/@heyyiwen123" target="_blank">
            <div className={styles.icon} id={styles.medium}></div>
          </a>
          <a href="mailto:ywgao1998@163.com">
            <div className={styles.icon} id={styles.email}></div>
          </a>
          <a href="https://www.instagram.com/1vvenn/" target="_blank">
            <div className={styles.icon} id={styles.instagram}></div>
          </a>
        </div>
      </div>
    </>
  );
}
