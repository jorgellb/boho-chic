-- =====================================================
-- CONFIGURACIÓN DE SUPABASE PARA TIENDA DE AFILIADOS
-- =====================================================
-- Ejecuta este SQL en el SQL Editor de Supabase
-- =====================================================

-- 1. CREAR TABLA DE PRODUCTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  description TEXT,
  category VARCHAR(100),
  affiliate_url TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREAR ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Índice para búsqueda de texto (opcional, mejora búsquedas)
CREATE INDEX IF NOT EXISTS idx_products_name_search 
ON products USING gin(to_tsvector('spanish', name));

-- 3. HABILITAR ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 4. CREAR POLÍTICAS DE SEGURIDAD
-- =====================================================

-- Política: Cualquiera puede ver productos activos
DROP POLICY IF EXISTS "Productos públicos son visibles" ON products;
CREATE POLICY "Productos públicos son visibles" ON products
  FOR SELECT 
  USING (active = true);

-- Política: Usuarios autenticados pueden ver todos los productos
DROP POLICY IF EXISTS "Admins pueden ver todos los productos" ON products;
CREATE POLICY "Admins pueden ver todos los productos" ON products
  FOR SELECT 
  TO authenticated
  USING (true);

-- Política: Usuarios autenticados pueden insertar productos
DROP POLICY IF EXISTS "Admins pueden crear productos" ON products;
CREATE POLICY "Admins pueden crear productos" ON products
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Política: Usuarios autenticados pueden actualizar productos
DROP POLICY IF EXISTS "Admins pueden actualizar productos" ON products;
CREATE POLICY "Admins pueden actualizar productos" ON products
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Usuarios autenticados pueden eliminar productos
DROP POLICY IF EXISTS "Admins pueden eliminar productos" ON products;
CREATE POLICY "Admins pueden eliminar productos" ON products
  FOR DELETE 
  TO authenticated
  USING (true);

-- 5. FUNCIÓN PARA ACTUALIZAR TIMESTAMP
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. TRIGGER PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
-- =====================================================
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. INSERTAR PRODUCTOS DE EJEMPLO (OPCIONAL)
-- =====================================================
-- Descomenta las siguientes líneas si quieres productos de prueba

/*
INSERT INTO products (name, price, original_price, description, category, affiliate_url, active, tags) VALUES
('Auriculares Bluetooth Premium', 29.99, 49.99, 'Auriculares inalámbricos con cancelación de ruido y 24h de batería.', 'Electrónica', 'https://amazon.es/dp/EJEMPLO1', true, ARRAY['oferta', 'destacado']),
('Smartwatch Deportivo', 89.99, 129.99, 'Reloj inteligente con GPS, monitor cardíaco y resistente al agua.', 'Electrónica', 'https://amazon.es/dp/EJEMPLO2', true, ARRAY['nuevo', 'destacado']),
('Mochila Antirrobo', 34.99, NULL, 'Mochila con puerto USB integrado y compartimento acolchado para portátil.', 'Accesorios', 'https://amazon.es/dp/EJEMPLO3', true, ARRAY['nuevo']),
('Lámpara LED Escritorio', 19.99, 29.99, 'Lámpara con 5 niveles de brillo, puerto USB y brazo flexible.', 'Hogar', 'https://amazon.es/dp/EJEMPLO4', true, ARRAY['oferta']),
('Teclado Mecánico Gaming', 59.99, 79.99, 'Teclado mecánico RGB con switches blue y reposamuñecas.', 'Gaming', 'https://amazon.es/dp/EJEMPLO5', true, ARRAY['gaming', 'destacado']);
*/

-- =====================================================
-- CONFIGURACIÓN DE STORAGE (Ejecutar por separado)
-- =====================================================
-- 1. Ve a Storage en Supabase
-- 2. Crea un bucket llamado "products"
-- 3. Márcalo como "Public"
-- 4. Ejecuta estas políticas en el SQL Editor:

-- Permitir a usuarios autenticados subir imágenes
/*
CREATE POLICY "Usuarios autenticados pueden subir imágenes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');
*/

-- Permitir a todos ver las imágenes
/*
CREATE POLICY "Imágenes son públicas"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');
*/

-- Permitir a usuarios autenticados eliminar imágenes
/*
CREATE POLICY "Usuarios autenticados pueden eliminar imágenes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products');
*/

-- =====================================================
-- ¡LISTO! Tu base de datos está configurada.
-- Ahora crea un usuario en Authentication > Users
-- para poder acceder al panel de administración.
-- =====================================================
