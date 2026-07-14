import { Metadata } from "next";

interface GenerateMetadataProps {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  noIndex?: boolean;
}

const SITE_URL = process.env.NEXT_PUBLIC_STORE_URL || "https://trendrushx.com";
const DEFAULT_IMAGE = `${SITE_URL}/assets/images/og-default.jpg`;

export function constructMetadata({
  title,
  description,
  path,
  imageUrl,
  noIndex = false,
}: GenerateMetadataProps): Metadata {
  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: path,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "TRENDRUSH X",
      images: [
        {
          url: imageUrl || DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl || DEFAULT_IMAGE],
      creator: "@trendrushx",
    },
  };
}