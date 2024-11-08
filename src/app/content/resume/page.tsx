import React from 'react';
import styles from './page.module.sass';
export default function Index() {
    const pdfUrl = '/Yiwen_Gao.pdf'; // 替换为你的PDF文件的实际路径

    return (
        <div className={styles.container}>
           <div className={styles.resume}>
            <embed src={pdfUrl} type="application/pdf" width='100%' height='100%' />
            </div>
        </div>
    );
}