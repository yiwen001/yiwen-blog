// pages/content/projects/page.tsx

"use client";
import React, { useState, useEffect } from 'react';
import styles from './page.module.sass';

type ProjectMetadata = {
  title: string;
  description: string;
  ogImage: string;
  type?: 'github' | 'chrome-extension';
};

export default function Index() {
  const [projectsMetadata, setProjectsMetadata] = useState<Array<ProjectMetadata>>([]);
  const projectUrls = [
    'https://github.com/yiwen001/Match-4-Game',
    'https://github.com/yiwen001/GPT-Theme',
 
    // Add more GitHub repository URLs here
  ];
//try2
  async function fetchMetadata(url: string) {
    try {
      const repoUrl = new URL(url);
      const parts = repoUrl.pathname.split('/');
      const owner = parts[1];
      const repo = parts[2];

      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        }
      });
      const data = await response.json();
      
      return {
        title: data.name,
        description: data.description,
        ogImage: `https://opengraph.githubassets.com/${data.id}/${owner}/${repo}`,
      };
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return null;
    }
  }

  useEffect(() => {
    const getMetadata = async () => {
      const results = await Promise.all(
        projectUrls.map(url => fetchMetadata(url))
      );
      const validResults = results.filter((result): result is NonNullable<typeof result> => result !== null);
      setProjectsMetadata(validResults);
    };
    getMetadata();
  }, []);

  return (
    <>
    <div className={styles.container}>
      {projectsMetadata.map((metadata, index) => (
        <div 
          key={index} 
          className={styles.card}
          onClick={() => window.open(projectUrls[index], '_blank')}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.imageContainer}>
            <img src="https://github.com/favicon.ico" className={styles.image} alt="GitHub Icon" />
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.title}>{metadata.title}</h2>
            <p className={styles.description}>{metadata.description}</p>
          </div>
        </div>
      ))}
      </div>
    </>
  );
}