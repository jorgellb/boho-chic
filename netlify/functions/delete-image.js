const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Verificar autenticación
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'No autorizado' }),
    };
  }

  const token = authHeader.replace('Bearer ', '');

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

  // Verificar que el usuario es admin
  const adminEmail = process.env.GATSBY_ADMIN_EMAIL;
  if (adminEmail && user.email !== adminEmail) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'No tienes permisos de administrador' }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { url, bucket = 'products' } = body;

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL no proporcionada' }),
      };
    }

    // Extraer el path del archivo de la URL
    const path = url.split(`${bucket}/`).pop();
    
    if (!path) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No se pudo extraer el path del archivo' }),
      };
    }

    // Crear cliente con service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Eliminar el archivo
    const { error: deleteError } = await supabaseAdmin.storage
      .from(bucket)
      .remove([path]);

    if (deleteError) {
      console.error('Error deleting:', deleteError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: deleteError.message }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Imagen eliminada correctamente',
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
