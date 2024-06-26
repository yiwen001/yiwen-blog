"use client"
import styles from "./page.module.css";
import {Button} from "@nextui-org/button";
import { useRouter } from 'next/navigation';
import React, { useRef,useState } from 'react';
export default function Home() {
  const router = useRouter();
  const aboutRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const handleClick = () => {
    setIsVisible(true); // 设置 About Me 部分为可见
    setTimeout(() => {
      aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
    },100); // 稍微延迟滚动以确保 CSS 过渡生效
  };
  return (
    <>
    <div className={styles.main}>
      <div className={styles.nav}>
        <div className={styles.icon} id={styles.menu} style={{width:'25px',height:'25px'}}></div>
      </div>
       <div className={styles.content}>  
       <div className={styles.mainline}>  Hi, I am Yiwen  </div>
     
       <Button className={styles.customButton}  onClick={handleClick}>
       About me 👋
      </Button> 
        
        </div> 
        <div className={styles.footer}>
        <a href="https://github.com/yiwen001" target="_blank">
        <div className={styles.icon} id={styles.github} style={{height:'18px'}}></div>
        </a>
        <a href="https://www.linkedin.com/in/yiwen-gao-ab5580220/" target="_blank">
      <div className={styles.icon} id={styles.linkedin}></div>   </a>
      <a href="https://medium.com/@heyyiwen123" target="_blank">
 
      <div className={styles.icon} id={styles.medium}></div> </a>
      <a href="mailto:ywgao1998@163.com">
      <div className={styles.icon} id={styles.email}></div></a>
      <a href="https://www.instagram.com/1vvenn/" target="_blank">
    
      <div className={styles.icon} id={styles.instagram}></div></a>
 

        </div>

     
   
       
    </div>
    <div ref={aboutRef} className={`${styles.aboutSection} ${isVisible ? styles.aboutSectionVisible : ''}`}>
      <div className={styles.secondMain}>
      <div className={styles.secondNav}>
     <div> About Me</div> 
     <div className={styles.icon} id={styles.menu} style={{width:'20px',height:'20px'}}></div></div>
     <div className={styles.intro}>
      <p>
      Hi, I am Rony! I'm a designer with 3 years of web development
      experience with the past 2 years spent honing my skills in
      WordPress, Shopify. And Webflow
      Hi, I am Rony! I'm a designer with 3 years of web development
      experience with the past 2 years spent honing my skills in
      WordPress, Shopify. And Webflow
      </p>
      <div className={styles.intro2}>
     
      Hi, I am Rony! I'm a designer with 3 years of web development
      experience with the past 2 years spent honing my skills in
      WordPress, Shopify. And Webflow
    
      <div className={styles.avatar}></div>
      </div>
     </div>
     </div>
 </div>
 

 </>
  
  );
}
