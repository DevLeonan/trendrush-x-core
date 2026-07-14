"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

interface ProductGalleryProps {
  images: { id: string; url: string; alt: string }[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (!images?.length) return null;

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full">
      {/* Thumbnails (Vertical no Desktop, Horizontal no Mobile) */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto hide-scrollbar snap-x pb-2 lg:pb-0 lg:w-24">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "relative aspect-square w-20 lg:w-full flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 snap-center",
              activeIndex === index 
                ? "border-brand-blue shadow-neon-blue" 
                : "border-border/50 hover:border-border opacity-70 hover:opacity-100"
            )}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative aspect-square w-full flex-1 rounded-2xl overflow-hidden bg-card/30 border border-border/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover cursor-zoom-in"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}