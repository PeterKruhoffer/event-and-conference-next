import { EventImage } from "./EventImage"
import { EventRegistrationForm } from "./EventRegistrationForm"
import { formatEventType, getEventTypeClass } from "./EventTeaser.helpers"
import { getEventAvailability } from "@/lib/conference"
import { formatDateTime, formatTimeUntil } from "@/lib/utils"
import type { DrupalNode } from "next-drupal"

interface EventProps {
  node: DrupalNode
}

export async function Event({ node, ...props }: EventProps) {
  const eventType = node.field_event_type ? String(node.field_event_type) : ""
  const timeUntilSignupDeadline = node.field_signup_deadline
    ? formatTimeUntil(node.field_signup_deadline)
    : null
  const availability = await getEventAvailability(node.drupal_internal__nid)

  return (
    <article
      className="relative left-1/2 w-[calc(100vw-3rem)] max-w-6xl -translate-x-1/2"
      {...props}
    >
      <h1 className="mb-4 text-5xl font-black leading-tight sm:text-6xl">
        {node.title}
      </h1>
      {eventType && (
        <div className="mb-4">
          <span
            aria-label={`Event type: ${formatEventType(eventType)}`}
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase ${getEventTypeClass(
              eventType
            )}`}
          >
            {formatEventType(eventType)}
          </span>
        </div>
      )}
      <dl className="grid gap-x-10 gap-y-4 mb-6 text-gray-700 sm:grid-cols-2 lg:grid-cols-3">
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
            <dd>
              <span>{formatDateTime(node.field_signup_deadline)}</span>
              {timeUntilSignupDeadline && (
                <span className="mt-1 block text-sm font-medium text-gray-500">
                  {timeUntilSignupDeadline === "Signup deadline passed"
                    ? timeUntilSignupDeadline
                    : `Deadline ${timeUntilSignupDeadline}`}
                </span>
              )}
            </dd>
          </div>
        )}
      </dl>
      {node.drupal_internal__nid && (
        <EventRegistrationForm
          availability={availability}
          eventId={node.drupal_internal__nid}
          eventTitle={node.title}
        />
      )}
      <EventImage node={node} priority />
      {node.field_description?.processed && (
        <div
          dangerouslySetInnerHTML={{
            __html: node.field_description.processed,
          }}
          className="mt-6 max-w-none font-serif text-xl leading-loose prose"
        />
      )}
    </article>
  )
}
