import Image from "next/image";

/** Hosts configured in `next.config` for `next/image` optimization. */
const NEXT_IMAGE_HOSTS = new Set(["images.unsplash.com"]);

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

/**
 * User-supplied cover URLs may point to any HTTPS host; `next/image` only allows configured hosts.
 * Falls back to `<img>` so new listings always render.
 */
export function ListingCoverMedia({ src, alt, fill, sizes, className, priority }: Props) {
  let host = "";
  try {
    host = new URL(src).hostname;
  } catch {
    return null;
  }

  const useNext = NEXT_IMAGE_HOSTS.has(host);

  if (useNext && fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- intentional fallback for arbitrary HTTPS hosts
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        className={`absolute inset-0 h-full w-full object-cover ${className ?? ""}`}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} loading={priority ? "eager" : "lazy"} />
  );
}
