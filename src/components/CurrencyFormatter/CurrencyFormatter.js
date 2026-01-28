import React from 'react';
import { isNumeric } from '../../helpers/general';
// import * as styles from './CurrencyFormatter.module.css';

const CurrencyFormatter = ({
  amount,
  currency = 'EUR',
  appendZero = true,
}) => {
  let displayAmount =
    (typeof amount !== 'number' && parseFloat(amount?.replace(/[€$]/g, ''))) ||
    amount;

  if (!isNumeric(displayAmount)) {
    return <span>Precio no disponible</span>;
  }

  /* Format price for EUR in Spanish locale */
  const formatObject = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: appendZero ? 2 : 0,
    maximumFractionDigits: 2,
  });

  const formattedPrice = formatObject.format(displayAmount);

  return <span>{formattedPrice}</span>;
};

export default CurrencyFormatter;
