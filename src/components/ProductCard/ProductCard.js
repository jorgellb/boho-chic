import React from 'react';
import * as styles from './ProductCard.module.css';
import CurrencyFormatter from '../CurrencyFormatter';

const ProductCard = (props) => {
  const {
    image,
    imageAlt,
    name,
    price,
    originalPrice,
    affiliateUrl,
    height = 580,
  } = props;

  const handleClick = () => {
    if (affiliateUrl) {
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={styles.root}>
      <div
        className={styles.imageContainer}
        onClick={handleClick}
        role={'presentation'}
        style={{ cursor: affiliateUrl ? 'pointer' : 'default' }}
      >
        <img 
          style={{ height: `${height}px` }} 
          src={image || '/products/placeholder.png'} 
          alt={imageAlt || name}
          loading="lazy"
        />
        {/* Botón VER PRECIO superpuesto */}
        <div className={styles.priceButtonContainer}>
          <button 
            className={styles.priceButton}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            VER PRECIO
          </button>
        </div>
      </div>
      <div className={styles.detailsContainer}>
        <span className={styles.productName}>{name}</span>
        <div className={styles.prices}>
          <span className={`${originalPrice !== undefined ? styles.salePrice : ''}`}>
            <CurrencyFormatter amount={price}></CurrencyFormatter>
          </span>
          {originalPrice && (
            <span className={styles.originalPrice}>
              <CurrencyFormatter amount={originalPrice}></CurrencyFormatter>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
