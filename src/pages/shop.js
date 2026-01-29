import React, { useState, useEffect } from 'react';
import * as styles from './shop.module.css';

import Banner from '../components/Banner';
import Breadcrumbs from '../components/Breadcrumbs';
import Container from '../components/Container';
import Chip from '../components/Chip';
import Icon from '../components/Icons/Icon';
import Layout from '../components/Layout';
import ProductCardGrid from '../components/ProductCardGrid';
import Button from '../components/Button';
import Seo from '../components/Seo';
import { supabase } from '../lib/supabase';

const ShopPage = (props) => {
  const [showFilter, setShowFilter] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 12;

  // Cargar productos
  const loadProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('active', true);

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setProducts(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías
  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('active', true)
        .not('category', 'is', null);

      if (error) throw error;

      const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories.sort());
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const escapeHandler = (e) => {
      if (e?.keyCode === 27) setShowFilter(false);
    };
    window.addEventListener('keydown', escapeHandler);
    return () => window.removeEventListener('keydown', escapeHandler);
  }, []);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const breadcrumbs = [
    { link: '/', label: 'Inicio' },
    { label: selectedCategory || 'Botas Cowboy' },
  ];

  return (
    <Layout>
      <Seo
        title="Catálogo Botas Cowboy - Ofertas Exclusivas"
        description="Explora nuestra selección de botas cowboy. Compara precios y encuentra la mejor oferta en botas vaqueras para hombre y mujer."
        pathname="/shop"
        schemaType="CollectionPage"
        products={products}
        breadcrumbs={breadcrumbs}
      />
      <div className={styles.root}>
        <Container size={'large'} spacing={'min'}>
          <div className={styles.breadcrumbContainer}>
            <Breadcrumbs
              crumbs={breadcrumbs}
            />
          </div>
        </Container>
        <Banner
          maxWidth={'650px'}
          name={selectedCategory || 'Catálogo Botas Cowboy'}
          subtitle={
            'Explora nuestra selección de botas cowboy para hombre y mujer. Haz clic en "Ver Oferta" para ir directamente a la mejor oferta disponible.'
          }
        />
        <Container size={'large'} spacing={'min'}>
          <div className={styles.metaContainer}>
            <span className={styles.itemCount}>{totalCount} botas cowboy</span>
            <div className={styles.controllerContainer}>
              <div
                className={styles.iconContainer}
                role={'presentation'}
                onClick={() => setShowFilter(!showFilter)}
              >
                <Icon symbol={'filter'} />
                <span>Categorías</span>
              </div>
            </div>
          </div>

          {/* Filtro de categorías */}
          {showFilter && (
            <div className={styles.chipsContainer}>
              <Chip
                name={'Todas'}
                close={false}
              />
              {categories.map(cat => (
                <Chip
                  key={cat}
                  name={cat}
                  close={false}
                />
              ))}
            </div>
          )}

          <div className={styles.productContainer}>
            <span className={styles.mobileItemCount}>{totalCount} botas cowboy</span>
            {loading ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#666'
              }}>
                Cargando botas cowboy...
              </div>
            ) : products.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#666'
              }}>
                No hay botas cowboy disponibles
              </div>
            ) : (
              <ProductCardGrid data={products} />
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className={styles.loadMoreContainer}>
              <span>{Math.min(currentPage * itemsPerPage, totalCount)} de {totalCount}</span>
              <div className={styles.paginationContainer}>
                {currentPage > 1 && (
                  <Button
                    level={'secondary'}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    ← Anterior
                  </Button>
                )}
                {currentPage < totalPages && (
                  <Button
                    level={'secondary'}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    Siguiente →
                  </Button>
                )}
              </div>
            </div>
          )}
        </Container>
      </div>
    </Layout>
  );
};

export default ShopPage;
