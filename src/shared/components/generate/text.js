import React from 'react';
import styles from './generate.module.scss';
export default function Text() {
  return (
    <div className={styles.backgroundWrapper}>
      {[1,2,3,4,5,6,7,8,9,0,10].map((item)=>
        <div key={item} className={styles.bgCard}>

        </div>
      )}
    </div>
  );
}
