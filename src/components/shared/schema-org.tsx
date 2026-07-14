import * as React from "react";

interface ProductSchemaProps {
  product: {
    id: string;
    name: string;
    description: string;
    image: string;
    url: string;
    price: number;
    currency?: string;
    availability?: "InStock" | "OutOfStock";
    ratingValue?: number;
    reviewCount?: number;
  };
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "sku": product.id,
    "name": product.name,
    "description": product.description,
    "image": [product.image],
    "url": product.url,
    "brand": {
      "@type": "Brand",
      "name": "TRENDRUSH X"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": product.currency || "BRL",
      "price": product.price.toFixed(2),
      "availability": product.availability === "InStock" 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "url": product.url,
      "seller": {
        "@type": "Organization",
        "name": "TRENDRUSH X"
      }
    },
    ...(product.ratingValue && product.reviewCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.ratingValue.toFixed(1),
        "reviewCount": product.reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    } : {})
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema estático para a Home Page (Organização)
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TRENDRUSH X",
    "url": "https://trendrushx.com",
    "logo": "https://trendrushx.com/assets/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-00-00000-0000",
      "contactType": "customer service",
      "availableLanguage": ["Portuguese"]
    },
    "sameAs": [
      "https://instagram.com/trendrushx",
      "https://tiktok.com/@trendrushx"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}