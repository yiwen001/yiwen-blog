"use client";
import styles from "./page.module.sass";
import React, { useEffect, useRef, useState } from 'react';
import Navigation from '../components/Navigation';
import dynamic from 'next/dynamic';
import AboutSection from '../about/page';
import ProjectsSection from '../projects/page';

const DynamicShape = dynamic(() => import('../components/DynamicShape'), { ssr: false });

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const sectionsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      Object.entries(sectionsRef.current).forEach(([key, element]) => {
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop - 100 && 
            scrollPosition < offsetTop + offsetHeight - 100
          ) {
            setActiveSection(key);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (section: string) => {
    sectionsRef.current[section]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navigation activeSection={activeSection} onNavClick={scrollToSection} />
      
      <div className={styles.container}>
        <section 
          ref={el => sectionsRef.current['home'] = el}
          className={styles.section}
        >
          <div className={styles.content}>
            <div className={styles.mainline}>
              <div className={styles.textWrapper}>
                Hi, I am Yiwen
              </div>
              <div className={styles.circle}>
                <DynamicShape />
              </div>
            </div>
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
        </section>

        <section 
          ref={el => sectionsRef.current['about'] = el}
          className={styles.section}
        >
          <AboutSection />
        </section>

        <section 
          ref={el => sectionsRef.current['projects'] = el}
          className={styles.section}
        >
          <ProjectsSection />
        </section>
      </div>
    </>
  );
}
