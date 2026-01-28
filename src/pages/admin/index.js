import React, { useState, useEffect, useRef } from 'react';
import { navigate } from 'gatsby';
import { supabase, uploadImage, deleteImage } from '../../lib/supabase';
import * as styles from '../../styles/admin.module.css';

// Componente de Login
const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>🛍️ Admin Panel</h1>
        <p className={styles.loginSubtitle}>Gestiona tu tienda de afiliados</p>
        
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Email</label>
            <input
              type="email"
              className={styles.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tutienda.com"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Contraseña</label>
            <input
              type="password"
              className={styles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar al Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Modal para crear/editar productos
const ProductModal = ({ product, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    affiliate_url: product?.affiliate_url || '',
    image_url: product?.image_url || '',
    tags: product?.tags?.join(', ') || '',
    active: product?.active ?? true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image_url || '');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      // Subir nueva imagen si hay una
      if (imageFile) {
        // Eliminar imagen anterior si existe y es de Supabase
        if (product?.image_url && product.image_url.includes('supabase')) {
          await deleteImage(product.image_url);
        }
        imageUrl = await uploadImage(imageFile);
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        affiliate_url: formData.affiliate_url,
        image_url: imageUrl,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        active: formData.active,
      };

      if (product?.id) {
        // Actualizar
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);
        if (error) throw error;
      } else {
        // Crear
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
      }

      onSave();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Imagen */}
            <div className={`${styles.inputGroup} ${styles.formGridFull}`}>
              <label className={styles.inputLabel}>Imagen del producto</label>
              <div 
                className={styles.imageUpload}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className={styles.imageUploadPreview}
                  />
                ) : (
                  <div className={styles.emptyStateIcon}>📷</div>
                )}
                <p className={styles.imageUploadText}>
                  <strong>Click para subir</strong> o arrastra una imagen
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.hiddenInput}
                />
              </div>
            </div>

            <div className={styles.formGrid}>
              {/* Nombre */}
              <div className={`${styles.inputGroup} ${styles.formGridFull}`}>
                <label className={styles.inputLabel}>Nombre del producto *</label>
                <input
                  type="text"
                  name="name"
                  className={styles.inputField}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Botas Camperas de Mujer"
                  required
                />
              </div>

              {/* Categoría */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Categoría</label>
                <input
                  type="text"
                  name="category"
                  className={styles.inputField}
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Calzado"
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>

              {/* Tags */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Tags (separados por coma)</label>
                <input
                  type="text"
                  name="tags"
                  className={styles.inputField}
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="oferta, nuevo, destacado"
                />
              </div>

              {/* URL de afiliado */}
              <div className={`${styles.inputGroup} ${styles.formGridFull}`}>
                <label className={styles.inputLabel}>Enlace de afiliado *</label>
                <input
                  type="url"
                  name="affiliate_url"
                  className={styles.inputField}
                  value={formData.affiliate_url}
                  onChange={handleChange}
                  placeholder="https://amazon.es/dp/XXXXXX?tag=tuafiliado-21"
                  required
                />
              </div>

              {/* Descripción */}
              <div className={`${styles.inputGroup} ${styles.formGridFull}`}>
                <label className={styles.inputLabel}>Descripción</label>
                <textarea
                  name="description"
                  className={styles.textareaField}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe el producto..."
                  rows={4}
                />
              </div>

              {/* Activo */}
              <div className={styles.inputGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span className={styles.inputLabel} style={{ margin: 0 }}>
                    Producto activo
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button 
              type="button" 
              className={styles.secondaryButton}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.primaryButton}
              disabled={loading}
            >
              {loading ? 'Guardando...' : (product ? 'Actualizar' : 'Crear Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Dashboard principal
const Dashboard = ({ user, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [toast, setToast] = useState(null);
  const itemsPerPage = 10;

  const showToast = (message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  };

  // Cargar productos
  const loadProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
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
      showToast('Error cargando productos', true);
      console.error(err);
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
  }, [search, categoryFilter, currentPage]);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Eliminar "${product.name}"?`)) return;

    try {
      // Eliminar imagen si existe
      if (product.image_url && product.image_url.includes('supabase')) {
        await deleteImage(product.image_url);
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      showToast('Producto eliminado');
      loadProducts();
      loadCategories();
    } catch (err) {
      showToast('Error eliminando producto', true);
    }
  };

  const handleSave = () => {
    setShowModal(false);
    setEditingProduct(null);
    showToast(editingProduct ? 'Producto actualizado' : 'Producto creado');
    loadProducts();
    loadCategories();
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>🛍️ Panel de Administración</h1>
          <div className={styles.headerActions}>
            <span className={styles.userEmail}>{user.email}</span>
            <button className={styles.logoutButton} onClick={onLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className={styles.main}>
        {/* Actions */}
        <div className={styles.actionsContainer}>
          <button 
            className={styles.primaryButton}
            onClick={() => {
              setEditingProduct(null);
              setShowModal(true);
            }}
          >
            + Nuevo Producto
          </button>
        </div>

        {/* Stats */}
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Productos</div>
            <div className={styles.statValue}>{totalCount}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Categorías</div>
            <div className={styles.statValue}>{categories.length}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Productos Activos</div>
            <div className={styles.statValue}>
              {products.filter(p => p.active).length}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className={styles.toolbarContainer}>
          <input
            type="text"
            placeholder="Buscar productos..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <span>Cargando productos...</span>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>📦</div>
              <div className={styles.emptyStateTitle}>No hay productos</div>
              <p>Crea tu primer producto para empezar</p>
            </div>
          ) : (
            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img 
                        src={product.image_url || '/products/placeholder.png'} 
                        alt={product.name}
                        className={styles.productImage}
                      />
                    </td>
                    <td>
                      <div className={styles.productName}>{product.name}</div>
                      <div className={styles.productCategory}>
                        {product.tags?.slice(0, 3).join(', ')}
                      </div>
                    </td>
                    <td>{product.category || '-'}</td>
                    <td>
                      <span style={{
                        background: product.active ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                        color: product.active ? '#10b981' : '#ef4444',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {product.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.iconButton}
                          onClick={() => handleEdit(product)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <a 
                          href={product.affiliate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.iconButton}
                          title="Ver enlace afiliado"
                        >
                          🔗
                        </a>
                        <button 
                          className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                          onClick={() => handleDelete(product)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ← Anterior
            </button>
            <span className={styles.pageInfo}>
              Página {currentPage} de {totalPages}
            </span>
            <button
              className={styles.pageButton}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente →
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${toast.isError ? styles.toastError : ''}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

// Página principal del Admin
const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className={styles.adminRoot}>
        <div className={styles.loadingContainer} style={{ minHeight: '100vh' }}>
          <div className={styles.spinner}></div>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminRoot}>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={setUser} />
      )}
    </div>
  );
};

export default AdminPage;

export const Head = () => <title>Admin Panel - Tienda de Afiliados</title>;
