import React from 'react';
import * as styles from './ProductCardGrid.module.css';

import ProductCard from '../ProductCard';
import Slider from '../Slider';

const ProductCardGrid = (props) => {
  const { height, columns = 3, data, spacing, showSlider = false } = props;
  const columnCount = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  const renderCards = () => {
    return data.map((product, index) => {
      return (
        <ProductCard
          key={product.id || index}
          height={height}
          price={product.price}
          imageAlt={product.alt || product.name}
          name={product.name}
          image={product.image || product.image_url}
          originalPrice={product.originalPrice || product.original_price}
          affiliateUrl={product.affiliateUrl || product.affiliate_url}
        />
      );
    });
  };

  return (
    <div className={styles.root} style={columnCount}>
      <div
        className={`${styles.cardGrid} ${
          showSlider === false ? styles.show : ''
        }`}
        style={columnCount}
      >
        {data && renderCards()}
      </div>

      {showSlider === true && (
        <div className={styles.mobileSlider}>
          <Slider spacing={spacing}>{data && renderCards()}</Slider>
        </div>
      )}
    </div>
  );
};

export default ProductCardGrid;
