import { EventTeaser } from "@/components/drupal/event/EventTeaser"
import { drupal } from "@/lib/drupal"
import type { Metadata } from "next"
import type { DrupalNode } from "next-drupal"

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events from Drupal.",
}

export default async function EventsPage() {
  const nodes = await drupal.getResourceCollection<DrupalNode[]>(
    "node--event",
    {
      params: {
        "filter[status]": 1,
        include: "field_event_image",
        "fields[node--event]":
          "title,path,drupal_internal__nid,field_capacity,field_end_date,field_event_image,field_event_type,field_location,field_signup_deadline,field_start_date",
        sort: "field_start_date",
      },
      next: {
        revalidate: 3600,
      },
    }
  )

  return (
    <>
      <h1 className="mb-10 text-6xl font-black">Events.</h1>
      {nodes?.length ? (
        nodes.map((node) => (
          <div key={node.id}>
            <EventTeaser node={node} />
            <hr className="my-20" />
          </div>
        ))
      ) : (
        <p className="py-4">No events found</p>
      )}
    </>
  )
}
