"use client";
import React from 'react';
import styles from './page.module.sass';
import Basic3D from './Basic3D';
export default function Index() {
 

    return (
        <div className={styles.container}>
            <Basic3D/>
        </div>
    );
}