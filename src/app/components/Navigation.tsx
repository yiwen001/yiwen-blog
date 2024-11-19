import React from 'react';
import styles from './Navigation.module.sass';

interface NavigationProps {
  activeSection: string;
  onNavClick: (section: string) => void;
}

export default function Navigation({ activeSection, onNavClick }: NavigationProps) {
  return (
    <nav className={styles.navigation}>
      <ul>
        <li 
          className={activeSection === 'home' ? styles.active : ''}
          onClick={() => onNavClick('home')}
        >
          Home
        </li>
        <li 
          className={activeSection === 'about' ? styles.active : ''}
          onClick={() => onNavClick('about')}
        >
          About
        </li>
        <li 
          className={activeSection === 'projects' ? styles.active : ''}
          onClick={() => onNavClick('projects')}
        >
          Projects
        </li>
      </ul>
    </nav>
  );
} 