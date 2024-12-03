"use client";
import styles from "./page.module.sass";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Navigation from '../components/Navigation';
import AboutSection from '../about/page';
import ProjectsSection from '../projects/page';
import Resume from '../resume/page';
interface SectionRefs {
  [key: string]: HTMLDivElement | null;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const sectionsRef = useRef<SectionRefs>({
    home: null,
    about: null,
    projects: null,
    resume: null,
  });
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const handleScroll = useCallback(() => {
    if (scrollTimeout.current) {
      return; // 如果已经有待处理的更新，直接返回
    }

    scrollTimeout.current = setTimeout(() => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      Object.entries(sectionsRef.current).forEach(([key, element]) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          // 使用元素在视口中的位置来判断
          if (rect.top <= windowHeight * 0.3 && rect.bottom >= windowHeight * 0.3) {
            setActiveSection(key);
          }
        }
      });
      
      scrollTimeout.current = null;
    }, 50); // 50ms 的节流时间
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleScroll]);

  const scrollToSection = useCallback((section: string) => {
    const element = sectionsRef.current[section];
    if (element) {
      const offset = element.offsetTop;
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <Navigation activeSection={activeSection} onNavClick={scrollToSection} />
      
      <div className={styles.container}>
        <section 
          ref={(el: HTMLDivElement | null) => {
            sectionsRef.current['home'] = el;
          }}
          className={styles.section}
        >
          <div className={styles.content}>
            <div className={styles.mainline}>
              <div className={styles.textWrapper}>
                Hi, I am Yiwen
              </div>
              {/* <div className={styles.circle}>
                <DynamicShape />
              </div> */}
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
          ref={(el: HTMLDivElement | null) => {
            sectionsRef.current['about'] = el;
          }}
          className={styles.section}
        >
          <AboutSection />
        </section>

        <section 
          ref={(el: HTMLDivElement | null) => {
            sectionsRef.current['projects'] = el;
          }}
          className={styles.section}
        >
          <ProjectsSection />
        </section>

        <section
          ref={(el: HTMLDivElement | null) => {
            sectionsRef.current['resume'] = el;
          }}
          className={styles.section}
        >
          <Resume/>
        </section>
      </div>
    </div>
  );
}
