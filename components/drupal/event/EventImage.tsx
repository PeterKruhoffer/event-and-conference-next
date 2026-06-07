import Image from "next/image"
import { absoluteUrl } from "@/lib/utils"
import type { DrupalNode } from "next-drupal"

interface EventImageProps {
  className?: string
  node: DrupalNode
  priority?: boolean
}

export function EventImage({
  className,
  node,
  priority = false,
}: EventImageProps) {
  const image = node.field_event_image
  const imageUrl = image?.uri?.url

  if (!imageUrl) {
    return null
  }

  return (
    <figure className={className}>
      <Image
        src={absoluteUrl(imageUrl)}
        width={1152}
        height={600}
        alt={image.resourceIdObjMeta?.alt || ""}
        priority={priority}
        sizes="(min-width: 1280px) 1152px, calc(100vw - 3rem)"
        className="h-auto w-full"
      />
      {image.resourceIdObjMeta?.title && (
        <figcaption className="py-2 text-sm text-center text-gray-600">
          {image.resourceIdObjMeta.title}
        </figcaption>
      )}
    </figure>
  )
}
