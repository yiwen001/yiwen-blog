import styles from './index.module.sass';
export default function Circle(){
    return(
        <div className={styles.circle}>
            <div className={styles.pointer}> </div>
        </div>
    );
}