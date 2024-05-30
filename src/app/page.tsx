import styles from "./page.module.css";
import {Button} from "@nextui-org/button";
export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.nav}></div>
       <div className={styles.content}>  
       <div className={styles.mainline}>  Hi, I am Yiwen  </div>
     
       <Button className={styles.customButton}>
       About me 👋
      </Button> 
        
        </div> 
        <div className={styles.footer}>
        <div className={styles.icon} id={styles.github}></div>
      <div className={styles.icon} id={styles.linkedin}></div>
      <div className={styles.icon} id={styles.email}></div>
      <div className={styles.icon} id={styles.medium}></div>
      <div className={styles.icon} id={styles.instagram}></div>
 

        </div>
       
       
    </div>
  );
}
