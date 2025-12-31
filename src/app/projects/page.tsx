// pages/content/projects/page.tsx

"use client";
import React from 'react';
import Image from 'next/image';
import styles from './page.module.sass';
 

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
        <div
          key={index} 
          className={styles.card}
          onClick={() => window.open(project.url, '_blank')}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.imageContainer}>
            <Image 
              src={getIcon(project.type)} 
              className={styles.image} 
              alt={`${project.type} Icon`}
              width={48}
              height={48}
            />
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.title}>{project.title}</h2>
            <p className={styles.description}>{project.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}