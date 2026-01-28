import React from 'react';
import { Helmet } from 'react-helmet';

const Seo = ({
    title = 'Botas Cowboy - Las Mejores Ofertas Online',
    description = 'Encuentra las mejores botas cowboy al mejor precio. Comparamos ofertas de las mejores marcas para hombre y mujer. ¡Ahorra tiempo y dinero!',
    pathname = '',
    article = false,
    image = '/banner1.png',
    schemaType = 'WebPage',
    products = [],
    breadcrumbs = [],
}) => {
    const siteUrl = 'https://tiendaboho.netlify.app';
    const siteName = 'Tienda Botas Cowboy';
    const url = `${siteUrl}${pathname}`;
    const imageUrl = `${siteUrl}${image}`;

    // Schema Organization
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteName,
        url: siteUrl,
        description: 'Comparador de ofertas en botas cowboy. Encontramos las mejores botas vaqueras al mejor precio.',
        logo: `${siteUrl}/logo.png`,
    };

    // Schema WebSite con SearchAction
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        url: siteUrl,
        description: 'Las mejores ofertas en botas cowboy para hombre y mujer',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteUrl}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };

    // Schema WebPage o CollectionPage
    const pageSchema = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        name: title,
        description: description,
        url: url,
        isPartOf: {
            '@type': 'WebSite',
            name: siteName,
            url: siteUrl,
        },
    };

    // Schema BreadcrumbList
    const breadcrumbSchema = breadcrumbs.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.label,
            item: crumb.link ? `${siteUrl}${crumb.link}` : undefined,
        })),
    } : null;

    // Schema ItemList para productos
    const itemListSchema = products.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Botas Cowboy - Catálogo',
        description: 'Selección de botas cowboy con las mejores ofertas',
        numberOfItems: products.length,
        itemListElement: products.slice(0, 10).map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: product.name,
            url: product.affiliateUrl || url,
        })),
    } : null;

    return (
        <Helmet>
            {/* Meta básicos */}
            <html lang="es" />
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:site_name" content={siteName} />
            <meta property="og:type" content={article ? 'article' : 'website'} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:locale" content="es_ES" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />

            {/* Keywords */}
            <meta name="keywords" content="botas cowboy, botas vaqueras, botas western, botas cowboy mujer, botas cowboy hombre, botas cowboy baratas, ofertas botas cowboy" />

            {/* Schema.org JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(websiteSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(pageSchema)}
            </script>
            {breadcrumbSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            )}
            {itemListSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(itemListSchema)}
                </script>
            )}
        </Helmet>
    );
};

export default Seo;
