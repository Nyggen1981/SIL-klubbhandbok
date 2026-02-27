'use client';

import { Zoom } from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const basePath = process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : '';

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function ImageZoom({ src, alt, width, height, className }: Props) {
  const resolvedSrc = typeof src === 'string' && src.startsWith('/') ? `${basePath}${src}` : src;
  return (
    <Zoom>
      <img
        src={resolvedSrc}
        alt={alt}
        width={width ?? 800}
        height={height ?? 500}
        className={className ?? 'rounded max-w-full h-auto cursor-zoom-in'}
        loading="lazy"
      />
    </Zoom>
  );
}
