import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.GATSBY_SUPABASE_URL || '';
const supabaseAnonKey = process.env.GATSBY_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper para convertir archivo a base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Helper para obtener el token de sesión actual
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
};

// Helper para subir imágenes usando Netlify Function
export const uploadImage = async (file, bucket = 'products') => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('No hay sesión activa');
  }

  // Convertir archivo a base64
  const fileData = await fileToBase64(file);
  
  const response = await fetch('/.netlify/functions/upload-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      fileData,
      fileName: file.name,
      contentType: file.type,
      bucket,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Error al subir imagen');
  }

  return result.url;
};

// Helper para eliminar imágenes usando Netlify Function
export const deleteImage = async (url, bucket = 'products') => {
  if (!url) return;
  
  // Solo intentar eliminar si es una URL de Supabase
  if (!url.includes('supabase')) return;

  const token = await getAuthToken();
  
  if (!token) {
    console.warn('No hay sesión activa para eliminar imagen');
    return;
  }

  try {
    const response = await fetch('/.netlify/functions/delete-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        url,
        bucket,
      }),
    });

    if (!response.ok) {
      const result = await response.json();
      console.error('Error eliminando imagen:', result.error);
    }
  } catch (error) {
    console.error('Error eliminando imagen:', error);
  }
};
