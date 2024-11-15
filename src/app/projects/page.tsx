// pages/content/projects/page.tsx

"use client";
import React from 'react';
import styles from './page.module.sass';
import { motion } from 'framer-motion';

type Project = {
  title: string;
  description: string;
  url: string;
  type: 'github' | 'chrome';
};

const projects: Project[] = [
  {
    title: 'Match-4-Game',
    description: 'A classic Connect Four game implementation',
    url: 'https://github.com/yiwen001/Match-4-Game',
    type: 'github'
  },
 
  {
    title: 'GPT-Theme',
    description: 'A ChatGPT theme customization project',
    url: 'https://chromewebstore.google.com/detail/gpt-theme/opgkagnoipbbbpjjnnlnpfoeakdihgkh?authuser=0&hl=en',
    type: 'chrome'
  },
  // 可以继续添加更多项目
];

export default function Index() {
  const getIcon = (type: string) => {
    switch(type) {
      case 'chrome':
        return 'https://www.google.com/chrome/static/images/chrome-logo.svg';
      case 'github':
      default:
        return 'https://github.com/favicon.ico';
    }
  };

  return (
    <div className={styles.container}>
      {projects.map((project, index) => (
        <motion.div 
          key={index} 
          className={styles.card}
          onClick={() => window.open(project.url, '_blank')}
          style={{ cursor: 'pointer' }}
          initial={{ 
            y: -20* index, // 所有卡片初始位置重叠在第一个位置
            opacity: 0 
          }}
          animate={{ 
            y: 1, // 移动到最终位置
            opacity: 1 
          }}
          transition={{
            type: "spring",
            bounce: 0.1,     // 添加弹跳效果
            duration: 0.1,      // 增加动画时长
            delay: index * 0.01,
            damping: 3,       // 减小阻尼以增加弹跳
            stiffness: 8,   // 增加刚度使动画更有力
            restDelta: 0.001  // 使动画更精确
          }}
        >
          <div className={styles.imageContainer}>
            <img 
              src={getIcon(project.type)} 
              className={styles.image} 
              alt={`${project.type} Icon`} 
            />
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.title}>{project.title}</h2>
            <p className={styles.description}>{project.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}