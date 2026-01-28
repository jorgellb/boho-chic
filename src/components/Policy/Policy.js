import React from 'react';
import * as styles from './Policy.module.css';

const Policy = ({ type = 'privacy' }) => {
  // Contenido de Política de Privacidad
  const PrivacyContent = () => (
    <>
      <div className={styles.section}>
        <h3>1. Información que Recopilamos</h3>
        <p>
          En Boho Chic (bohochic.es), respetamos tu privacidad. Como sitio de afiliados
          especializado en botas cowboy, recopilamos información limitada cuando navegas
          por nuestro catálogo de productos.
        </p>
        <p>
          Podemos recopilar información básica como tu dirección IP, tipo de navegador,
          páginas visitadas y tiempo de navegación. Esta información nos ayuda a mejorar
          tu experiencia de búsqueda de botas cowboy.
        </p>
        <p>
          <strong>Importante:</strong> No procesamos pagos ni almacenamos información de
          tarjetas de crédito. Todas las compras se realizan directamente en las tiendas
          de los vendedores afiliados.
        </p>
      </div>

      <div className={styles.section}>
        <h3>2. Uso de Cookies</h3>
        <p>
          Utilizamos cookies para mejorar tu experiencia de navegación y para fines de
          seguimiento de afiliados. Estas cookies nos permiten:
        </p>
        <p>
          • Recordar tus preferencias de navegación<br />
          • Analizar el tráfico del sitio para mejorar nuestro contenido<br />
          • Gestionar nuestras relaciones con programas de afiliados
        </p>
        <p>
          Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar
          algunas funcionalidades del sitio.
        </p>
      </div>

      <div className={styles.section}>
        <h3>3. Enlaces a Terceros</h3>
        <p>
          Nuestro sitio contiene enlaces a tiendas externas donde puedes comprar botas cowboy.
          Al hacer clic en "Ver Oferta", serás redirigido al sitio del vendedor.
        </p>
        <p>
          Cada tienda externa tiene su propia política de privacidad. Te recomendamos leer
          las políticas de privacidad de cada vendedor antes de realizar una compra.
        </p>
        <p>
          Boho Chic no es responsable de las prácticas de privacidad de sitios externos.
        </p>
      </div>

      <div className={styles.section}>
        <h3>4. Tus Derechos</h3>
        <p>
          De acuerdo con el Reglamento General de Protección de Datos (RGPD), tienes derecho a:
        </p>
        <p>
          • Acceder a tus datos personales<br />
          • Rectificar datos inexactos<br />
          • Solicitar la eliminación de tus datos<br />
          • Oponerte al procesamiento de tus datos
        </p>
        <p>
          Para ejercer estos derechos, contáctanos a través de nuestro formulario de contacto.
        </p>
      </div>
    </>
  );

  // Contenido de Términos y Condiciones
  const TermsContent = () => (
    <>
      <div className={styles.section}>
        <h3>1. Sobre Boho Chic</h3>
        <p>
          Boho Chic (bohochic.es) es un sitio web de afiliados especializado en botas cowboy.
          No vendemos productos directamente. Nuestro servicio consiste en comparar precios
          y mostrarte las mejores ofertas de botas vaqueras disponibles en tiendas online.
        </p>
        <p>
          Al hacer clic en "Ver Oferta", serás redirigido a la tienda del vendedor donde
          podrás completar tu compra. Podemos recibir una comisión por las compras realizadas
          a través de nuestros enlaces, sin coste adicional para ti.
        </p>
      </div>

      <div className={styles.section}>
        <h3>2. Precios y Disponibilidad</h3>
        <p>
          Los precios mostrados en nuestro sitio son orientativos y pueden variar. El precio
          final siempre será el indicado en la tienda del vendedor al momento de la compra.
        </p>
        <p>
          No garantizamos la disponibilidad de los productos. El stock depende de cada vendedor
          y puede agotarse sin previo aviso.
        </p>
      </div>

      <div className={styles.section}>
        <h3>3. Responsabilidad</h3>
        <p>
          Boho Chic no es responsable de:
        </p>
        <p>
          • La calidad de los productos vendidos por terceros<br />
          • Problemas con envíos o devoluciones<br />
          • Cambios de precio o disponibilidad<br />
          • El contenido de sitios externos
        </p>
        <p>
          Cualquier reclamación sobre productos debe dirigirse directamente al vendedor.
        </p>
      </div>

      <div className={styles.section}>
        <h3>4. Propiedad Intelectual</h3>
        <p>
          Todo el contenido de bohochic.es, incluyendo textos, diseño y logotipos, está
          protegido por derechos de autor. Queda prohibida su reproducción sin autorización.
        </p>
        <p>
          Las imágenes de productos pertenecen a sus respectivos propietarios y se utilizan
          con fines informativos.
        </p>
      </div>
    </>
  );

  // Contenido de Envíos
  const ShippingContent = () => (
    <>
      <div className={styles.section}>
        <h3>Información sobre Envíos</h3>
        <p>
          En Boho Chic no realizamos envíos directamente. Somos un comparador de precios
          de botas cowboy que te conecta con las mejores tiendas online.
        </p>
        <p>
          Cada tienda afiliada tiene sus propias políticas de envío. Al hacer clic en
          "Ver Oferta" y acceder a la tienda del vendedor, podrás consultar:
        </p>
        <p>
          • Costes de envío<br />
          • Tiempos de entrega<br />
          • Países disponibles<br />
          • Opciones de envío express
        </p>
      </div>

      <div className={styles.section}>
        <h3>Consejo</h3>
        <p>
          Te recomendamos revisar las condiciones de envío de cada vendedor antes de
          realizar tu compra. Algunas tiendas ofrecen envío gratuito a partir de cierto
          importe o en promociones especiales.
        </p>
      </div>
    </>
  );

  // Contenido de Devoluciones
  const ReturnsContent = () => (
    <>
      <div className={styles.section}>
        <h3>Política de Devoluciones</h3>
        <p>
          Las devoluciones de botas cowboy se gestionan directamente con la tienda donde
          realizaste la compra. Cada vendedor tiene su propia política de devoluciones.
        </p>
        <p>
          Generalmente, las tiendas online ofrecen un plazo de 14-30 días para devoluciones,
          siempre que el producto esté sin usar y en su embalaje original.
        </p>
      </div>

      <div className={styles.section}>
        <h3>¿Cómo hacer una devolución?</h3>
        <p>
          1. Contacta con el servicio de atención al cliente de la tienda donde compraste<br />
          2. Solicita el número de devolución o etiqueta de envío<br />
          3. Empaqueta las botas en su caja original<br />
          4. Envía el paquete según las instrucciones del vendedor
        </p>
        <p>
          <strong>Nota:</strong> Boho Chic no puede gestionar devoluciones ya que no somos
          el vendedor del producto.
        </p>
      </div>
    </>
  );

  // Contenido de Pagos
  const PaymentsContent = () => (
    <>
      <div className={styles.section}>
        <h3>Pagos y Seguridad</h3>
        <p>
          Boho Chic no procesa pagos. Todas las transacciones se realizan de forma segura
          en las plataformas de los vendedores afiliados.
        </p>
        <p>
          Las tiendas con las que trabajamos utilizan métodos de pago seguros como:
        </p>
        <p>
          • Tarjetas de crédito/débito (Visa, Mastercard, American Express)<br />
          • PayPal<br />
          • Transferencia bancaria<br />
          • Bizum (en tiendas españolas)
        </p>
      </div>

      <div className={styles.section}>
        <h3>Seguridad en tus Compras</h3>
        <p>
          Todos los vendedores afiliados utilizan conexiones seguras (HTTPS) y encriptación
          SSL para proteger tu información de pago.
        </p>
        <p>
          Te recomendamos verificar que la URL del vendedor muestre el candado de seguridad
          antes de introducir tus datos de pago.
        </p>
      </div>
    </>
  );

  return (
    <div className={styles.root}>
      {type === 'privacy' && <PrivacyContent />}
      {type === 'terms' && <TermsContent />}
      {type === 'shipping' && <ShippingContent />}
      {type === 'returns' && <ReturnsContent />}
      {type === 'payments' && <PaymentsContent />}
    </div>
  );
};

export default Policy;
