import ImageZoom from '@/components/ImageZoom';

export function MdxImage({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const altText = alt ?? '';
  return (
    <ImageZoom
      src={src ?? ''}
      alt={altText}
      width={typeof width === 'number' ? width : undefined}
      height={typeof height === 'number' ? height : undefined}
      className={className}
    />
  );
}

export const mdxComponents = {
  img: MdxImage,
  Image: MdxImage,
};
