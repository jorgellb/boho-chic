import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Hook para cargar productos
export const useProducts = (options = {}) => {
  const { 
    limit = 12, 
    category = null, 
    search = null,
    tags = [],
    offset = 0 
  } = options;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*', { count: 'exact' })
          .eq('active', true);

        if (category) {
          query = query.eq('category', category);
        }

        if (search) {
          query = query.ilike('name', `%${search}%`);
        }

        if (tags.length > 0) {
          query = query.overlaps('tags', tags);
        }

        const { data, error, count } = await query
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw error;

        setProducts(data || []);
        setTotalCount(count || 0);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit, category, search, JSON.stringify(tags), offset]);

  return { products, loading, error, totalCount };
};

// Hook para cargar un producto por ID o slug
export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

// Hook para cargar categorías
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
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
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};

// Hook para búsqueda de productos
export const useProductSearch = (query, limit = 10) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, image_url, price, affiliate_url')
          .eq('active', true)
          .ilike('name', `%${query}%`)
          .limit(limit);

        if (error) throw error;
        setResults(data || []);
      } catch (err) {
        console.error('Error searching products:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [query, limit]);

  return { results, loading };
};
