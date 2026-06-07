import { EventImage } from "@/components/drupal/EventImage"
import { Link } from "@/components/navigation/Link"
import { formatDateTime } from "@/lib/utils"
import type { DrupalNode } from "next-drupal"

interface EventTeaserProps {
  node: DrupalNode
}

export function EventTeaser({ node, ...props }: EventTeaserProps) {
  const eventPath = node.path?.alias

  return (
    <article {...props}>
      <EventImage node={node} className="mb-6" />
      {eventPath ? (
        <Link href={eventPath} className="no-underline hover:text-blue-600">
          <h2 className="mb-4 text-4xl font-bold">{node.title}</h2>
        </Link>
      ) : (
        <h2 className="mb-4 text-4xl font-bold">{node.title}</h2>
      )}
      <dl className="grid gap-3 mb-6 text-gray-700 sm:grid-cols-2">
        {node.field_start_date && (
          <div>
            <dt className="font-semibold text-gray-950">Starts</dt>
            <dd>{formatDateTime(node.field_start_date)}</dd>
          </div>
        )}
        {node.field_end_date && (
          <div>
            <dt className="font-semibold text-gray-950">Ends</dt>
            <dd>{formatDateTime(node.field_end_date)}</dd>
          </div>
        )}
        {node.field_location && (
          <div>
            <dt className="font-semibold text-gray-950">Location</dt>
            <dd>{node.field_location}</dd>
          </div>
        )}
        {node.field_capacity && (
          <div>
            <dt className="font-semibold text-gray-950">Capacity</dt>
            <dd>{node.field_capacity}</dd>
          </div>
        )}
      </dl>
      {node.field_description?.processed && (
        <div
          dangerouslySetInnerHTML={{
            __html: node.field_description.processed,
          }}
          className="font-serif text-xl leading-loose prose"
        />
      )}
      {eventPath && (
        <Link
          href={eventPath}
          className="inline-flex items-center px-6 py-2 mt-6 border border-gray-600 rounded-full hover:bg-gray-100"
        >
          View event
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 ml-2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </article>
  )
}
