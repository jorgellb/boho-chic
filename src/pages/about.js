import React, { useRef } from 'react';

import Container from '../components/Container';
import Hero from '../components/Hero';
import ThemeLink from '../components/ThemeLink';
import Layout from '../components/Layout/Layout';
import Seo from '../components/Seo';

import * as styles from './about.module.css';
import { toOptimizedImage } from '../helpers/general';

const AboutPage = (props) => {
  let missionRef = useRef();
  let valuesRef = useRef();
  let commitmentRef = useRef();

  const handleScroll = (elementReference) => {
    if (elementReference) {
      window.scrollTo({
        behavior: 'smooth',
        top: elementReference.current.offsetTop - 280,
      });
    }
  };

  return (
    <Layout disablePaddingBottom>
      <Seo
        title="Sobre Nosotros - Especialistas en Botas Cowboy"
        description="Somos expertos en encontrar las mejores ofertas en botas cowboy. Conoce nuestra misión de ayudarte a encontrar botas vaqueras al mejor precio."
        pathname="/about"
        schemaType="AboutPage"
        breadcrumbs={[
          { link: '/', label: 'Inicio' },
          { label: 'Sobre Nosotros' },
        ]}
      />
      <div className={styles.root}>
        {/* Hero Container */}
        <Hero
          maxWidth={'900px'}
          image={'/about.png'}
          title={`Tu Tienda de\nBotas Cowboy`}
        />

        <div className={styles.navContainer}>
          <ThemeLink onClick={() => handleScroll(missionRef)} to={'#mission'}>
            Nuestra Misión
          </ThemeLink>
          <ThemeLink onClick={() => handleScroll(valuesRef)} to={'#values'}>
            Valores
          </ThemeLink>
          <ThemeLink
            onClick={() => handleScroll(commitmentRef)}
            to={'#commitment'}
          >
            Compromiso
          </ThemeLink>
        </div>

        <Container size={'large'} spacing={'min'}>
          <div className={styles.detailContainer} ref={missionRef}>
            <p>
              Somos especialistas en botas cowboy y nos dedicamos a encontrar
              las mejores ofertas del mercado para ti. Comparamos precios de
              las principales tiendas y marcas para que tú solo tengas que elegir
              el estilo que más te gusta.
            </p>
            <br />
            <br />
            <p>
              Nuestra pasión por el estilo western nos impulsa a buscar
              las botas cowboy más auténticas y de mejor calidad. Ya sea que
              busques botas vaqueras para hombre o mujer, aquí encontrarás
              la mejor selección al mejor precio.
            </p>
          </div>
        </Container>

        <div className={styles.imageContainer}>
          <img alt={'botas cowboy calidad'} src={toOptimizedImage('/about1.png')}></img>
        </div>

        <Container size={'large'} spacing={'min'}>
          <div className={styles.content}>
            <h3>Nuestros Valores</h3>
            <div ref={valuesRef}>
              <p>
                Creemos en la transparencia y en ofrecer siempre el mejor valor
                a nuestros visitantes. No vendemos directamente, sino que te
                conectamos con las mejores ofertas de botas cowboy que hemos
                encontrado en toda la web.
              </p>
              <ol>
                <li>Transparencia en cada oferta</li>
                <li>Selección cuidadosa de productos de calidad</li>
                <li>Compromiso con el ahorro de nuestros usuarios</li>
              </ol>
              <img alt={'botas cowboy estilo'} src={toOptimizedImage('/about2.png')}></img>
            </div>
            <h3>Nuestro Compromiso</h3>
            <div id={'#commitment'} ref={commitmentRef}>
              <p>
                Nos comprometemos a actualizar constantemente nuestra selección
                de botas cowboy para ofrecerte siempre las mejores ofertas
                disponibles. Cada producto que mostramos ha sido verificado
                para garantizar su calidad y autenticidad.
              </p>
              <p>
                Ya sea que busques botas cowboy clásicas, botas western modernas
                o botas vaqueras con diseños únicos, nuestro objetivo es
                ahorrarte tiempo y dinero en tu búsqueda.
              </p>
              <p>
                Gracias por confiar en nosotros como tu guía para encontrar
                las botas cowboy perfectas.
              </p>
            </div>
          </div>
        </Container>

        <div className={styles.imageContainer}>
          <img alt={'botas cowboy colección'} src={toOptimizedImage('/about3.png')}></img>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
