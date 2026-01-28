-- =====================================================
-- CONFIGURACIÓN DE STORAGE PARA IMÁGENES
-- =====================================================
-- IMPORTANTE: Primero debes crear el bucket manualmente:
-- 1. Ve a Storage en el dashboard de Supabase
-- 2. Click en "New bucket"
-- 3. Nombre: products
-- 4. Marca "Public bucket"
-- 5. Click "Create bucket"
-- 
-- Luego ejecuta este SQL en el SQL Editor:
-- =====================================================

-- Permitir a usuarios autenticados subir imágenes
CREATE POLICY "auth_users_can_upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'products');

-- Permitir a todos ver las imágenes (bucket público)
CREATE POLICY "public_can_view" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'products');

-- Permitir a usuarios autenticados actualizar imágenes
CREATE POLICY "auth_users_can_update" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'products');

-- Permitir a usuarios autenticados eliminar imágenes
CREATE POLICY "auth_users_can_delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'products');
