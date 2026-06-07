import { Link } from "@/components/navigation/Link"
import {
  formatEventType,
  getEventDetailText,
  getEventTypeClass,
  isMultiDayEvent,
} from "./EventTeaser.helpers"
import { Teaser } from "./Teaser"
import { formatDateTimeRange } from "@/lib/utils"
import type { DrupalNode } from "next-drupal"
import type { ComponentPropsWithoutRef } from "react"

interface EventTeaserProps extends ComponentPropsWithoutRef<"article"> {
  node: DrupalNode
}

interface EventTeaserContentProps extends ComponentPropsWithoutRef<"article"> {
  title: string
  eventType: string
  eventTime: string
  eventDetails: string
  isMultiDay: boolean
}

function EventTeaserContent({
  title,
  eventType,
  eventTime,
  eventDetails,
  isMultiDay,
  ...props
}: EventTeaserContentProps) {
  return (
    <Teaser {...props}>
      {(eventType || isMultiDay) && (
        <Teaser.Badges>
          {eventType && (
            <Teaser.Badge className={getEventTypeClass(eventType)}>
              {formatEventType(eventType)}
            </Teaser.Badge>
          )}
          {isMultiDay && (
            <Teaser.Badge className="border-indigo-200 bg-indigo-50 text-indigo-700">
              Multi-day
            </Teaser.Badge>
          )}
        </Teaser.Badges>
      )}
      {eventTime && <Teaser.Date>{eventTime}</Teaser.Date>}
      <Teaser.Title>{title}</Teaser.Title>
      {eventDetails && <Teaser.Details>{eventDetails}</Teaser.Details>}
    </Teaser>
  )
}

export function EventTeaser({ node, ...props }: EventTeaserProps) {
  const eventPath =
    node.path?.alias ||
    (node.drupal_internal__nid ? `/node/${node.drupal_internal__nid}` : null)
  const eventTime = formatDateTimeRange(
    node.field_start_date,
    node.field_end_date
  )
  const eventDetails = getEventDetailText({
    location: node.field_location,
    capacity: node.field_capacity,
    signupDeadline: node.field_signup_deadline,
  })
  const isMultiDay = isMultiDayEvent(node.field_start_date, node.field_end_date)

  const teaserProps = {
    ...props,
    title: node.title,
    eventType: node.field_event_type,
    eventTime,
    eventDetails,
    isMultiDay,
  }

  if (eventPath) {
    return (
      <Link
        href={eventPath}
        aria-label={`View details for ${node.title}`}
        className="block no-underline"
      >
        <EventTeaserContent {...teaserProps} />
      </Link>
    )
  }

  return <EventTeaserContent {...teaserProps} />
}
