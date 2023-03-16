import React from 'react';
import loadingSvg from '../../assets/img/spinning-circles.svg';

import styles from './Loading.module.scss';

export const Loading: React.FC = () => {
  return (
    <div className={styles.root}>
      <img width="88" src={loadingSvg} alt="Loading" />
    </div>
  );
};
