import styles from "./page.module.css";
import {Button} from "@nextui-org/button";
export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.nav}>
        <div className={styles.icon} id={styles.menu} style={{width:'25px',height:'25px'}}></div>
      </div>
       <div className={styles.content}>  
       <div className={styles.mainline}>  Hi, I am Yiwen  </div>
     
       <Button className={styles.customButton}>
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
  );
}
