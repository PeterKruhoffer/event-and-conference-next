import { EventImage } from "@/components/drupal/EventImage"
import { formatDateTime } from "@/lib/utils"
import type { DrupalNode } from "next-drupal"

interface EventProps {
  node: DrupalNode
}

export function Event({ node, ...props }: EventProps) {
  return (
    <article {...props}>
      <h1 className="mb-4 text-6xl font-black leading-tight">{node.title}</h1>
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
        {node.field_signup_deadline && (
          <div>
            <dt className="font-semibold text-gray-950">Signup deadline</dt>
            <dd>{formatDateTime(node.field_signup_deadline)}</dd>
          </div>
        )}
        {node.field_event_type && (
          <div>
            <dt className="font-semibold text-gray-950">Type</dt>
            <dd>{node.field_event_type}</dd>
          </div>
        )}
      </dl>
      <EventImage node={node} priority />
      {node.field_description?.processed && (
        <div
          dangerouslySetInnerHTML={{
            __html: node.field_description.processed,
          }}
          className="mt-6 font-serif text-xl leading-loose prose"
        />
      )}
    </article>
  )
}
