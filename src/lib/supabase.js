import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.GATSBY_SUPABASE_URL || '';
const supabaseAnonKey = process.env.GATSBY_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper para subir imágenes
export const uploadImage = async (file, bucket = 'products') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

// Helper para eliminar imágenes
export const deleteImage = async (url, bucket = 'products') => {
  if (!url) return;
  const path = url.split(`${bucket}/`).pop();
  if (path) {
    await supabase.storage.from(bucket).remove([path]);
  }
};
