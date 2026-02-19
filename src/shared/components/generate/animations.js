import React from 'react';
import styles from './generate.module.scss';
import { Image } from 'antd';

export default function Animations({ onAnimationSelect, selectedAnimation }) {
  const imageData = [
    {
      id: 1,
      image_name: 'fade-in'
    },
    {
      id: 2,
      image_name: 'zoom-in'
    },
    {
      id: 3,
      image_name: 'slideDown'
    },
    {
      id: 4,
      image_name: 'roll-in'
    },
    {
      id: 5,
      image_name: 'bounce-in'
    },
    {
      id: 6,
      image_name: 'rotate-in'
    },
    {
      id: 7,
      image_name: 'lightSpeedIn'
    },
    {
      id: 8,
      image_name: 'flipInX'
    }
  ];

  return (
    <div className={styles.backgroundWrapper}>
      {imageData.map((item) => (
        <div
          key={item.id}
          className={`${styles.bgCard} ${
            selectedAnimation === item.image_name ? styles.selected : ''
          }`}
          onClick={() => onAnimationSelect(item)}
        >
          <Image
            preview={false}
            src={require(`../../../asset/images/animation/${item.image_name}.png`)}
          />
        </div>
      ))}
    </div>
  );
}
