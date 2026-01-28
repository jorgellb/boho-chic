# 🛍️ Tienda de Afiliados con Panel Admin

Una tienda de afiliados moderna construida con Gatsby y Supabase, lista para desplegar en Netlify de forma gratuita.

## ✨ Características

- ✅ **Panel de Administración** completo para gestionar productos
- ✅ **Sin carrito ni checkout** - Solo enlaces de afiliado
- ✅ **Botón "VER PRECIO"** en cada producto que redirige al enlace de afiliado
- ✅ **Búsqueda de productos** en tiempo real
- ✅ **Filtro por categorías**
- ✅ **Paginación** para manejar miles de productos
- ✅ **Subida de imágenes** integrada
- ✅ **Responsive** - Funciona en móviles y tablets
- ✅ **100% Gratuito** - Supabase + Netlify tienen generosos planes gratuitos

## 🚀 Guía de Configuración

### Paso 1: Crear cuenta en Supabase (Gratis)

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto (elige una región cercana a ti)
3. Espera a que el proyecto se inicialice (~2 minutos)

### Paso 2: Configurar la Base de Datos

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Copia y pega este SQL y ejecútalo:

```sql
-- Crear tabla de productos
CREATE TABLE products (
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

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('spanish', name));

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política para que todos puedan leer productos activos
CREATE POLICY "Productos públicos son visibles" ON products
  FOR SELECT USING (active = true);

-- Política para que usuarios autenticados puedan hacer todo
CREATE POLICY "Usuarios autenticados pueden gestionar productos" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Paso 3: Configurar Storage para Imágenes

1. En Supabase, ve a **Storage**
2. Crea un nuevo bucket llamado `products`
3. En la configuración del bucket, márcalo como **Public**
4. Ve a **Policies** y añade esta política:

```sql
-- Permitir subir imágenes a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden subir imágenes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

-- Permitir ver imágenes a todos
CREATE POLICY "Imágenes públicas"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

-- Permitir eliminar imágenes a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden eliminar imágenes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products');
```

### Paso 4: Crear Usuario Admin

1. En Supabase, ve a **Authentication** > **Users**
2. Click en **Add user** > **Create new user**
3. Introduce tu email y una contraseña segura
4. ¡Este será tu login para el panel de administración!

### Paso 5: Obtener las Credenciales

1. Ve a **Settings** > **API**
2. Copia:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon public key** (la clave larga que empieza con `eyJ...`)

### Paso 6: Configurar el Proyecto

1. Clona o descarga este repositorio
2. Crea un archivo `.env` en la raíz con:

```env
GATSBY_SUPABASE_URL=https://tu-proyecto.supabase.co
GATSBY_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

3. Instala dependencias:
```bash
npm install
```

4. Inicia el servidor de desarrollo:
```bash
npm run develop
```

5. Abre:
   - Tienda: http://localhost:8000
   - Panel Admin: http://localhost:8000/admin

### Paso 7: Desplegar en Netlify

1. Sube tu código a GitHub
2. Ve a [netlify.com](https://netlify.com) y conecta tu repositorio
3. En **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `public`
4. En **Environment variables**, añade:
   - `GATSBY_SUPABASE_URL`
   - `GATSBY_SUPABASE_ANON_KEY`
5. Click en **Deploy**!

## 📱 Uso del Panel Admin

1. Accede a `tudominio.com/admin`
2. Inicia sesión con el email/contraseña que creaste en Supabase
3. Desde ahí puedes:
   - ➕ Añadir nuevos productos
   - ✏️ Editar productos existentes
   - 🗑️ Eliminar productos
   - 📷 Subir imágenes
   - 🔍 Buscar y filtrar productos

## 📦 Estructura de un Producto

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `name` | Nombre del producto | "Auriculares Bluetooth Pro" |
| `price` | Precio actual | 29.99 |
| `original_price` | Precio tachado (opcional) | 49.99 |
| `description` | Descripción detallada | "Los mejores auriculares..." |
| `category` | Categoría | "Electrónica" |
| `affiliate_url` | Enlace de afiliado | "https://amazon.es/dp/..." |
| `image_url` | URL de la imagen | Se genera automáticamente |
| `tags` | Etiquetas | ["oferta", "nuevo"] |
| `active` | Visible en tienda | true/false |

## 🎨 Personalización

### Cambiar el Logo/Nombre
Edita `src/components/Brand/Brand.js`

### Cambiar Colores
Edita `src/components/Layout/Globals.css`

### Cambiar Menú de Navegación
Edita `src/config.json` > `headerLinks`

### Cambiar Footer
Edita `src/config.json` > `footerLinks`

## 💰 Límites Gratuitos

| Servicio | Plan Gratuito |
|----------|---------------|
| Supabase | 500MB DB, 1GB Storage, 2GB Bandwidth |
| Netlify | 100GB Bandwidth, Builds ilimitados |

Con estos límites puedes tener fácilmente **5,000+ productos** con imágenes.

## 🆘 Soporte

Si tienes problemas:
1. Revisa que las variables de entorno estén bien configuradas
2. Verifica que el usuario admin esté creado en Supabase
3. Comprueba que las políticas de RLS estén aplicadas
4. Mira la consola del navegador para errores

## 📝 Licencia

MIT - Usa este código como quieras.

---

Hecho con ❤️ para ayudarte a ganar con marketing de afiliados
