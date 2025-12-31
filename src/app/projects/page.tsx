// pages/content/projects/page.tsx

"use client";
import React from 'react';
import Image from 'next/image';
import styles from './page.module.sass';
 

type Project = {
  title: string;
  description: string;
  url: string;
  image: string;
};

const projects: Project[] = [
  {
    title: 'LeetMemo',
    description: '使用艾宾浩斯遗忘曲线高效复习 LeetCode 题目',
    url: 'http://43.142.161.179:8080/login',
    image: '/leetmemo.png'
  },
  {
    title: 'Luospace',
    description: 'Visual Communication Design & Information Experience Design',
    url: 'https://luospace.vercel.app/',
    image: '/luospace.png'
  }
];

export default function Index() {
  return (
    <div className={styles.container}>
      {projects.map((project, index) => (
        <div
          key={index} 
          className={styles.card}
          onClick={() => window.open(project.url, '_blank')}
          style={{ cursor: 'pointer' }}
        >
          <Image 
            src={project.image} 
            className={styles.image} 
            alt={`${project.title} Image`}
            width={600}
            height={400}
          />
        </div>
      ))}
    </div>
  );
}