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
            {/* Hi! I'm Yiwen, a Front-end Web Developer based in Shaoxing, China. With a Master's in Computer Engineering from NYU (GPA: 3.6/4.0), I'm currently working at Zhejiang University Shaoxing Research Institute. I specialize in developing sophisticated web applications, including a comprehensive topology editor based on <span className={styles.techStack}>AntV/X6</span> and responsive enterprise websites featuring complex SVG animations and interactive visualizations. */}
            In the digital ether, where pixels dance and code whispers, 
        this space emerges - a sanctuary of serendipity. 
        Here, the boundaries between art and technology dissolve, 
        like morning mist under the sun&apos;s gentle caress.

        Each interaction is a ripple in the pond of consciousness, 
        a fleeting moment where mathematics meets poetry. 
        The sphere breathes, responding to your touch, 
        its undulations echoing the rhythm of your curiosity.
          </div>
          <div className={styles.intro2}>
            <div className={styles.introText}>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
              {/* My core technical stack includes <span className={styles.techStack}>React</span>, <span className={styles.techStack}>TypeScript</span>, <span className={styles.techStack}>Umi</span>, and <span className={styles.techStack}>Next.js</span>, complemented by UI frameworks like <span className={styles.techStack}>Ant Design</span> and <span className={styles.techStack}>Chakra UI</span>. I have extensive experience in developing custom components, implementing complex visualizations with <span className={styles.techStack}>ECharts</span>, and deploying applications using <span className={styles.techStack}>Nginx</span>. I've also published a Chrome extension and developed cross-platform games using <span className={styles.techStack}>Egret</span>, demonstrating my versatility in front-end development. */}
            </div>
            This is not merely a website, but a living canvas - 
        where ideas bloom like wildflowers in the spring, 
        and creativity flows like a river carving its path through stone. 
        It&apos;s a mirror reflecting the infinite possibilities of the digital realm, 
        and a window into the soul of its creator.

        Wander through these digital corridors, 
        where every click is a step on a journey of discovery. 
        Let the colors and shapes speak to your subconscious, 
        and allow the subtle harmonies to resonate within you. 
        For in this space, we don&apos;t just observe - we experience, 
        we feel, we become part of the ever-evolving digital tapestry.
          </div>
        </div>
      </div>
    </div>
  );
}