import React from 'react';
import Link from 'next/link';
import styles from './resources.module.css';

export default function Resources() {
  return (
    <main className={styles.main}>
      <div className={styles.contentBox}>
        <section className={styles.featured}>
          <h2>Featured Resource</h2>
          <div className={styles.featuredLink}>
            The real cost of a bad hire
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </section>
        
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.active}`}>How it works</button>
          <button className={styles.tab}>Case studies</button>
          <button className={styles.tab}>Playbooks</button>
        </div>
        
        <div className={styles.grid}>
          {[
            "How it works",
            "Case studies",
            "ROI comparison",
            "Hiring playbooks",
            "Engine explainer",
            "FAQ"
          ].map((title, index) => {
            const slug = title.toLowerCase().replace(/ /g, '-');
            return (
              <Link href={`/resources/${slug}`} key={index} className={styles.cardLink} style={{textDecoration: 'none'}}>
                <div className={styles.card}>
                  <div className={styles.cardImg}>
                    <div className={styles.shimmer}></div>
                  </div>
                  <div className={styles.cardTitle}>{title}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
