"use client"

import { forwardRef } from "react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import type { AnchorHTMLAttributes, ReactNode } from "react"
import type { LinkProps as NextLinkProps } from "next/link"

type ImagePrefetchDescriptor = {
  loading?: string
  sizes?: string
  src?: string
  srcSet?: string
}

type LinkProps = NextLinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> & {
    children?: ReactNode
    intentPrefetch?: boolean
    prefetchImages?: ImagePrefetchDescriptor | ImagePrefetchDescriptor[]
  }

const prefetchedImages = new Set<string>()

function getInternalHref(href: NextLinkProps["href"]) {
  if (typeof href === "string") {
    return href.startsWith("/") ? href : null
  }

  if (typeof href.pathname === "string" && href.pathname.startsWith("/")) {
    const query = href.query
      ? `?${new URLSearchParams(
          Object.entries(href.query).flatMap(([key, value]) => {
            if (value == null) {
              return []
            }

            return Array.isArray(value)
              ? value.map((item) => [key, String(item)])
              : [[key, String(value)]]
          })
        ).toString()}`
      : ""

    return `${href.pathname}${query}${href.hash || ""}`
  }

  return null
}

function prefetchImage(image: ImagePrefetchDescriptor) {
  if (image.loading === "lazy" || !image.src) {
    return
  }

  const cacheKey = image.srcSet || image.src

  if (prefetchedImages.has(cacheKey)) {
    return
  }

  const img = new Image()
  img.decoding = "async"
  ;(
    img as HTMLImageElement & { fetchPriority?: "high" | "low" | "auto" }
  ).fetchPriority = "low"

  if (image.sizes) {
    img.sizes = image.sizes
  }

  if (image.srcSet) {
    img.srcset = image.srcSet
  }

  prefetchedImages.add(cacheKey)
  img.src = image.src
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  function LinkWithRef(
    {
      href,
      intentPrefetch = true,
      onClick,
      onFocus,
      onMouseDown,
      onMouseEnter,
      onPointerEnter,
      onTouchStart,
      prefetch,
      prefetchImages,
      ...props
    },
    ref
  ) {
    const router = useRouter()
    const hrefToPrefetch = getInternalHref(href)

    function warmDestination() {
      if (!intentPrefetch || prefetch === false) {
        return
      }

      if (hrefToPrefetch) {
        router.prefetch(hrefToPrefetch)
      }

      const images = Array.isArray(prefetchImages)
        ? prefetchImages
        : prefetchImages
          ? [prefetchImages]
          : []

      images.forEach(prefetchImage)
    }

    return (
      <NextLink
        {...props}
        href={href}
        prefetch={prefetch}
        ref={ref}
        onClick={(event) => {
          warmDestination()
          onClick?.(event)
        }}
        onFocus={(event) => {
          warmDestination()
          onFocus?.(event)
        }}
        onMouseDown={(event) => {
          warmDestination()
          onMouseDown?.(event)
        }}
        onMouseEnter={(event) => {
          warmDestination()
          onMouseEnter?.(event)
        }}
        onPointerEnter={(event) => {
          warmDestination()
          onPointerEnter?.(event)
        }}
        onTouchStart={(event) => {
          warmDestination()
          onTouchStart?.(event)
        }}
      />
    )
  }
)
