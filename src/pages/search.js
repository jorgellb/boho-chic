import React, { useState, useEffect } from 'react';

import Breadcrumbs from '../components/Breadcrumbs';
import Layout from '../components/Layout/Layout';
import Container from '../components/Container/Container';
import ProductCardGrid from '../components/ProductCardGrid';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';

import * as styles from './search.module.css';

const SearchPage = (props) => {
  // Usar URLSearchParams nativo en lugar de query-string
  const searchQuery = typeof window !== 'undefined' 
    ? new URLSearchParams(props.location.search).get('q') || ''
    : '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const searchProducts = async () => {
    if (!searchQuery) {
      setProducts([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('active', true)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setProducts(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    searchProducts();
  }, [searchQuery, currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <Layout>
      <div className={styles.root}>
        <Container size={'large'} spacing={'min'}>
          <Breadcrumbs
            crumbs={[
              { link: '/', label: 'Inicio' },
              { label: `Resultados para '${searchQuery}'` },
            ]}
          />
          <div className={styles.searchLabels}>
            <h4>Resultados para '{searchQuery}'</h4>
            <span>{totalCount} {totalCount === 1 ? 'resultado' : 'resultados'}</span>
          </div>
          
          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#666'
            }}>
              Buscando productos...
            </div>
          ) : products.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#666'
            }}>
              <h3 style={{ marginBottom: '12px', color: '#333' }}>No se encontraron productos</h3>
              <p>Intenta con otros términos de búsqueda</p>
            </div>
          ) : (
            <>
              <ProductCardGrid
                showSlider={false}
                height={400}
                columns={3}
                data={products}
              />
              
              {/* Paginación */}
              {totalPages > 1 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  gap: '16px',
                  marginTop: '40px',
                  marginBottom: '40px'
                }}>
                  {currentPage > 1 && (
                    <Button 
                      level={'secondary'}
                      onClick={() => setCurrentPage(p => p - 1)}
                    >
                      ← Anterior
                    </Button>
                  )}
                  <span style={{ color: '#666' }}>
                    Página {currentPage} de {totalPages}
                  </span>
                  {currentPage < totalPages && (
                    <Button 
                      level={'secondary'}
                      onClick={() => setCurrentPage(p => p + 1)}
                    >
                      Siguiente →
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </Container>
      </div>
    </Layout>
  );
};

export default SearchPage;
