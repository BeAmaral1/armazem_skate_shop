import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Armazém Skate Shop - Surf e Skate', 
  description = 'A melhor loja de surf e skate do Brasil. Pranchas, shapes, acessórios e vestuário das melhores marcas.',
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  price = null,
  product = null
}) => {
  const fullTitle = title.includes('Armazém') ? title : `${title} | Armazém Skate Shop`;
  const siteUrl = 'http://localhost:5173'; // Mudar para seu domínio em produção
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : siteUrl);
  
  // Structured Data (JSON-LD) para SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type === 'product' ? "Product" : "WebSite",
    "name": fullTitle,
    "description": description,
    "url": canonicalUrl,
    "image": fullImageUrl,
    ...(type === 'product' && product && {
      "offers": {
        "@type": "Offer",
        "price": price || product.price,
        "priceCurrency": "BRL",
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "url": canonicalUrl
      },
      "brand": {
        "@type": "Brand",
        "name": product.brand || "Armazém"
      },
      "aggregateRating": product.rating && {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviews?.length || 0
      }
    })
  };
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="surf, skate, pranchas, shapes, longboard, vestuário surf, acessórios skate, skateboard, surfboard" />
      
      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:secure_url" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Armazém Skate Shop" />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:site" content="@armazemskate" />
      <meta name="twitter:creator" content="@armazemskate" />
      
      {/* WhatsApp específico */}
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Product specific (se for produto) */}
      {type === 'product' && price && (
        <>
          <meta property="og:price:amount" content={price} />
          <meta property="og:price:currency" content="BRL" />
          <meta property="product:price:amount" content={price} />
          <meta property="product:price:currency" content="BRL" />
        </>
      )}
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="pt-BR" />
      <meta name="geo.region" content="BR" />
      <meta name="geo.placename" content="Brasil" />
      <meta name="author" content="Armazém Skate Shop" />
      <meta name="theme-color" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
