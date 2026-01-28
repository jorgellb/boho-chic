import React, { useState, useEffect } from 'react';

import Container from '../components/Container';
import Hero from '../components/Hero';
import Highlight from '../components/Highlight';
import Layout from '../components/Layout/Layout';
import ProductCardGrid from '../components/ProductCardGrid';
import Quote from '../components/Quote';
import Title from '../components/Title';
import { supabase } from '../lib/supabase';

import * as styles from './index.module.css';
import { navigate } from 'gatsby';

const IndexPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Cargar productos destacados (los primeros 6)
        const { data: featured } = await supabase
          .from('products')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(6);

        // Cargar productos nuevos (3 para el slider)
        const { data: newArrivals } = await supabase
          .from('products')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(3);

        setFeaturedProducts(featured || []);
        setNewProducts(newArrivals || []);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const goToShop = () => {
    navigate('/shop');
  };

  return (
    <Layout disablePaddingBottom>
      {/* Hero Container */}
      <Hero
        maxWidth={'500px'}
        image={'/banner1.png'}
        title={'Las Mejores Ofertas'}
        subtitle={'Productos seleccionados con los mejores precios'}
        ctaText={'ver productos'}
        ctaAction={goToShop}
      />

      {/* Message Container */}
      <div className={styles.messageContainer}>
        <p>
          Encuentra los <span className={styles.gold}>mejores productos</span> al mejor precio.
        </p>
        <p>
          Comparamos precios para que tú <span className={styles.gold}>ahorres más</span>
        </p>
      </div>

      {/* Featured Products */}
      <div className={styles.newArrivalsContainer}>
        <Container>
          <Title name={'Productos Destacados'} link={'/shop'} textLink={'ver todos'} />
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Cargando productos...
            </div>
          ) : featuredProducts.length > 0 ? (
            <ProductCardGrid
              spacing={true}
              showSlider
              height={400}
              columns={3}
              data={featuredProducts}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>No hay productos aún.</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Añade productos desde el <a href="/admin" style={{ color: '#c9a050' }}>panel de administración</a>
              </p>
            </div>
          )}
        </Container>
      </div>

      {/* Highlight  */}
      <div className={styles.highlightContainer}>
        <Container size={'large'} fullMobile>
          <Highlight
            image={'/highlight.png'}
            altImage={'productos destacados'}
            miniImage={'/highlightmin.png'}
            miniImageAlt={'mini imagen'}
            title={'Calidad Garantizada'}
            description={`Seleccionamos solo los mejores productos de vendedores verificados para garantizar tu satisfacción.`}
            textLink={'explorar'}
            link={'/shop'}
          />
        </Container>
      </div>

      {/* Quote */}
      <Quote
        bgColor={'var(--standard-light-grey)'}
        title={'Nuestra Promesa'}
        quote={
          '"Buscamos los mejores precios en toda la web para que tú no tengas que hacerlo. Ahorra tiempo y dinero con nuestras ofertas seleccionadas."'
        }
      />

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <div className={styles.newArrivalsContainer}>
          <Container>
            <Title name={'Recién Añadidos'} link={'/shop'} textLink={'ver todos'} />
            <ProductCardGrid
              spacing={true}
              showSlider
              height={400}
              columns={3}
              data={newProducts}
            />
          </Container>
        </div>
      )}
    </Layout>
  );
};

export default IndexPage;
