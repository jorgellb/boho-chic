import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import * as styles from './support.module.css';

import Banner from '../components/Banner';
import Contact from '../components/Contact';
import Layout from '../components/Layout/Layout';
import ThemeLink from '../components/ThemeLink';
import Policy from '../components/Policy';
import Container from '../components/Container';
import Seo from '../components/Seo';

const SupportPage = (props) => {
  const subpages = [
    { title: 'Envíos', key: 'shipping' },
    { title: 'Devoluciones', key: 'returns' },
    { title: 'Pagos y Seguridad', key: 'payments' },
    { title: 'Términos y Condiciones', key: 'terms' },
    { title: 'Contacto', key: 'contact' },
    { title: 'Política de Privacidad', key: 'policy' },
  ];

  const [current, setCurrent] = useState(subpages[4]);

  const renderElement = (key) => {
    let tempElement = <React.Fragment />;

    switch (key) {
      case 'contact':
        tempElement = <Contact />;
        break;
      case 'policy':
        tempElement = <Policy type="privacy" />;
        break;
      case 'shipping':
        tempElement = <Policy type="shipping" />;
        break;
      case 'returns':
        tempElement = <Policy type="returns" />;
        break;
      case 'payments':
        tempElement = <Policy type="payments" />;
        break;
      case 'terms':
        tempElement = <Policy type="terms" />;
        break;
      default:
        break;
    }
    return tempElement;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (props.location.hash !== '' && props.location.hash !== undefined) {
      const hash = props.location.hash.substring(1);
      const tempCurrent = subpages.filter((detail) => detail.key === hash)[0];
      if (tempCurrent && tempCurrent.key !== current.key) {
        setCurrent(tempCurrent);
        window.scrollTo(0, 475);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location]);

  return (
    <Layout disablePaddingBottom>
      <Seo
        title={`${current.title} - Boho Chic Botas Cowboy`}
        description="Información sobre envíos, devoluciones, pagos y políticas de Boho Chic, tu comparador de botas cowboy."
        pathname="/support"
        schemaType="WebPage"
      />
      <div className={styles.root}>
        <Banner
          maxWidth={'650px'}
          name={current.title}
          bgImage={'/support.png'}
          color={'var(--standard-white)'}
          height={'350px'}
        />

        <div className={styles.navContainer}>
          {subpages.map((details, index) => {
            return (
              <ThemeLink
                onClick={(e) => {
                  navigate(`/support#${details.key}`);
                }}
                key={details.key}
                isActive={current.key === details.key}
                to={`/support#${details.key}`}
              >
                {details.title}
              </ThemeLink>
            );
          })}
        </div>

        <div className={styles.pageContainer}>
          <Container size={'large'} spacing={'min'}>
            {subpages.map((details) => {
              return (
                <div
                  key={details.key}
                  className={`${styles.content} ${current.key === details.key ? styles.show : styles.hide
                    }`}
                >
                  {renderElement(details.key)}
                </div>
              );
            })}
          </Container>
        </div>
      </div>
    </Layout>
  );
};

export default SupportPage;
