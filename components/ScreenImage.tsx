import Image from "next/image";

interface Props {
  src: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  eager?: boolean;
}

// Larguras das versões WebP que ficam ao lado do JPG original, geradas com
// `magick <nome>.jpg -resize <largura>x -strip -quality 80 <nome>-<largura>.webp`.
// O JPG original entra como a maior opção, para telas retina no desktop.
const WEBP_WIDTHS = [828, 1080, 1600];

// Imagem que ocupa a tela inteira com object-cover. Como o site é exportado
// com `unoptimized`, o next/image não gera srcset, e o <picture> faz esse papel.
const ScreenImage = ({ src, width, height, alt, className, eager }: Props) => {
  const base = src.replace(/\.jpg$/, "");
  const srcSet = [
    ...WEBP_WIDTHS.map((w) => `${base}-${w}.webp ${w}w`),
    `${src} ${width}w`,
  ].join(", ");
  // Numa tela mais estreita que a foto, o object-cover corta pela altura, e a
  // largura desenhada passa a ser a altura da tela vezes a proporção da foto.
  const sizes = `(min-aspect-ratio: ${width}/${height}) 100vw, ${Math.ceil((100 * width) / height)}vh`;

  return (
    <picture>
      <source srcSet={srcSet} sizes={sizes} />
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        className={className}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
      />
    </picture>
  );
};

export default ScreenImage;
