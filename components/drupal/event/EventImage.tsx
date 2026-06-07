import Image from "next/image"
import { getImageProps } from "next/image"
import { absoluteUrl } from "@/lib/utils"
import type { DrupalNode } from "next-drupal"

interface EventImageProps {
  className?: string
  node: DrupalNode
  priority?: boolean
}

const EVENT_IMAGE_HEIGHT = 600
const EVENT_IMAGE_SIZES = "(min-width: 1280px) 1152px, calc(100vw - 3rem)"
const EVENT_IMAGE_WIDTH = 1152

function getEventImageData(node: DrupalNode) {
  const image = node.field_event_image
  const imageUrl = image?.uri?.url

  if (!imageUrl) {
    return null
  }

  return {
    alt: image.resourceIdObjMeta?.alt || "",
    src: absoluteUrl(imageUrl),
    title: image.resourceIdObjMeta?.title,
  }
}

export function getEventImagePrefetchProps(node: DrupalNode) {
  const image = getEventImageData(node)

  if (!image) {
    return null
  }

  return getImageProps({
    src: image.src,
    width: EVENT_IMAGE_WIDTH,
    height: EVENT_IMAGE_HEIGHT,
    alt: image.alt,
    sizes: EVENT_IMAGE_SIZES,
  }).props
}

export function EventImage({
  className,
  node,
  priority = false,
}: EventImageProps) {
  const image = getEventImageData(node)

  if (!image) {
    return null
  }

  return (
    <figure className={className}>
      <Image
        src={image.src}
        width={EVENT_IMAGE_WIDTH}
        height={EVENT_IMAGE_HEIGHT}
        alt={image.alt}
        priority={priority}
        sizes={EVENT_IMAGE_SIZES}
        className="h-auto w-full"
      />
      {image.title && (
        <figcaption className="py-2 text-sm text-center text-gray-600">
          {image.title}
        </figcaption>
      )}
    </figure>
  )
}
