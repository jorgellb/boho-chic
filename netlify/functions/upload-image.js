const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Verificar que el usuario está autenticado (verificar el token de Supabase)
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'No autorizado' }),
    };
  }

  const token = authHeader.replace('Bearer ', '');

  // Crear cliente de Supabase con la clave anónima para verificar el token
  const supabaseUrl = process.env.GATSBY_SUPABASE_URL;
  const supabaseAnonKey = process.env.GATSBY_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Configuración del servidor incorrecta' }),
    };
  }

  // Verificar el token del usuario
  const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

  if (authError || !user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Token inválido' }),
    };
  }

  // Verificar que el usuario es admin (comparar con GATSBY_ADMIN_EMAIL)
  const adminEmail = process.env.GATSBY_ADMIN_EMAIL;
  if (adminEmail && user.email !== adminEmail) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'No tienes permisos de administrador' }),
    };
  }

  try {
    // Parsear el body
    const body = JSON.parse(event.body);
    const { fileData, fileName, contentType, bucket = 'products' } = body;

    if (!fileData || !fileName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan datos del archivo' }),
      };
    }

    // Convertir base64 a buffer
    const base64Data = fileData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Crear cliente con service role key para subir
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Generar nombre único para el archivo
    const fileExt = fileName.split('.').pop();
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Subir el archivo
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(uniqueFileName, buffer, {
        contentType: contentType || 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading:', uploadError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: uploadError.message }),
      };
    }

    // Obtener URL pública
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(uniqueFileName);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        url: urlData.publicUrl,
        path: uniqueFileName,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
