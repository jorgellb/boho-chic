import React, { useState, useEffect } from 'react';

import Container from '../components/Container';
import Hero from '../components/Hero';
import Highlight from '../components/Highlight';
import Layout from '../components/Layout/Layout';
import ProductCardGrid from '../components/ProductCardGrid';
import Quote from '../components/Quote';
import Seo from '../components/Seo';
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
      <Seo
        title="Botas Cowboy - Las Mejores Ofertas Online"
        description="Encuentra las mejores botas cowboy al mejor precio. Comparamos ofertas de las mejores marcas para hombre y mujer. ¡Ahorra tiempo y dinero!"
        pathname="/"
        schemaType="WebPage"
        products={featuredProducts}
      />

      {/* Hero Container */}
      <Hero
        maxWidth={'500px'}
        image={'/banner1.png'}
        title={'Botas Cowboy Originales'}
        subtitle={'Las mejores ofertas en botas vaqueras para hombre y mujer'}
        ctaText={'ver catálogo'}
        ctaAction={goToShop}
      />

      {/* Message Container */}
      <div className={styles.messageContainer}>
        <p>
          Encuentra las mejores <span className={styles.gold}>botas cowboy</span> al mejor precio.
        </p>
        <p>
          Comparamos ofertas de las mejores <span className={styles.gold}>marcas</span> para ti.
        </p>
      </div>

      {/* Featured Products */}
      <div className={styles.newArrivalsContainer}>
        <Container>
          <Title name={'Botas Cowboy Destacadas'} link={'/shop'} textLink={'ver todas'} />
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Cargando botas cowboy...
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
              <p>No hay botas disponibles aún.</p>
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
            altImage={'botas cowboy destacadas'}
            miniImage={'/highlightmin.png'}
            miniImageAlt={'botas vaqueras'}
            title={'Botas Cowboy Auténticas'}
            description={'Seleccionamos botas cowboy de las mejores marcas y te mostramos dónde encontrarlas al mejor precio. Estilo western garantizado.'}
            textLink={'ver ofertas'}
            link={'/shop'}
          />
        </Container>
      </div>

      {/* Quote */}
      <Quote
        bgColor={'var(--standard-light-grey)'}
        title={'Nuestra Especialidad'}
        quote={
          '"Somos expertos en encontrar las mejores ofertas en botas cowboy. Te ahorramos tiempo comparando precios para que tú solo elijas tu estilo vaquero favorito."'
        }
      />

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <div className={styles.newArrivalsContainer}>
          <Container>
            <Title name={'Nuevas Botas Cowboy'} link={'/shop'} textLink={'ver todas'} />
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
