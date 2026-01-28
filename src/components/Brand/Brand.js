import React from 'react';
import { navigate } from 'gatsby';

import * as styles from './Brand.module.css';

const Brand = (props) => {
  return (
    <div
      className={styles.root}
      role={'presentation'}
      onClick={() => navigate('/')}
    >
      <h1 className={styles.logo}>BOTAS COWBOY</h1>
    </div>
  );
};

export default Brand;
