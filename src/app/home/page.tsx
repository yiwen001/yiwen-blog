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
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const scrollSoundRef = useRef<HTMLAudioElement | null>(null);
  const lastScrollTime = useRef<number>(0);
  const sectionsRef = useRef<SectionRefs>({
    home: null,
    about: null,
    projects: null,
    resume: null,
  });
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const handleScroll = useCallback(() => {
    if (scrollTimeout.current) {
      return;
    }

    // 播放滚动音效
    const currentTime = Date.now();
    if (currentTime - lastScrollTime.current > 50 && scrollSoundRef.current) { // 50ms 节流
      scrollSoundRef.current.currentTime = 0;
      scrollSoundRef.current.play()
        .catch(err => console.log('Scroll sound play failed:', err));
      lastScrollTime.current = currentTime;
    }

    scrollTimeout.current = setTimeout(() => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      Object.entries(sectionsRef.current).forEach(([key, element]) => {
        if (element) {
          const rect = element.getBoundingClientRect();//获得当前Dom对象
          if (rect.top <= windowHeight * 0.3 && rect.bottom >= windowHeight * 0.3) {
            setActiveSection(key);
          }
        }
      });
      
      scrollTimeout.current = null;
    }, 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [ ]);

  useEffect(() => {
    // 创建背景音乐
    const bgm = new Audio('/audio/SootheMySou_Departure.mp3');
    bgm.loop = true;
    bgm.volume = 0.3;
    bgmRef.current = bgm;

    // 创建点击音效
    const clickSound = new Audio('/audio/mouseclick.mp3');
    clickSound.volume = 0.1;
    clickSoundRef.current = clickSound;

   

    // 添加点击事件监听器
    const handleClick = () => {
      if (clickSoundRef.current) {
        
        clickSoundRef.current.play();
      }
    };

   

    document.addEventListener('click', handleClick);
 

    return () => {
      document.removeEventListener('click', handleClick);
     
      if (scrollSoundRef.current) {
        scrollSoundRef.current.removeEventListener('timeupdate', () => {});
      }
      if (bgmRef.current) {
        bgmRef.current.pause();
      }
    };
  }, []);

  const toggleMusic = useCallback(() => {
    if (bgmRef.current) {
      if (isMusicPlaying) {
        bgmRef.current.pause();
      } else {
        bgmRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  }, [isMusicPlaying]);

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
        <button 
          onClick={toggleMusic}
          className={styles.musicToggle}
          title={isMusicPlaying ? "Pause Music" : "Play Music"}
        >
          {isMusicPlaying ? "🎷" : "🤐"}
        </button>
        
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
