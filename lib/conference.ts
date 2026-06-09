export type EventAvailabilityState = "available" | "waitlist" | "closed"

export type EventAvailability = {
  eventId: number
  title: string
  capacity: number | null
  acceptedCount: number
  waitlistCount: number
  openSeats: number | null
  signupDeadline: string | null
  signupOpen: boolean
  state: EventAvailabilityState
  nextWaitlistPosition: number | null
}

export type EventRegistrationRequest = {
  name: string
  email: string
  phone?: string
  organization?: string
  dietaryRequirements?: string
  notes?: string
}

export type EventRegistrationStatus = "accepted" | "waitlisted" | "cancelled"

export type EventRegistrationResponse = {
  registrationId: number
  profileId: number
  eventId: number
  status: EventRegistrationStatus
  existing: boolean
  waitlistPosition: number | null
  availability: EventAvailability
}

export type EventRegistrationError = {
  message: string
  errors?: Partial<Record<keyof EventRegistrationRequest, string>>
  availability?: EventAvailability
}

function getDrupalBaseUrl() {
  return process.env.NEXT_PUBLIC_DRUPAL_BASE_URL?.replace(/\/$/, "")
}

export async function getEventAvailability(
  eventId?: number | string
): Promise<EventAvailability | null> {
  const drupalBaseUrl = getDrupalBaseUrl()

  if (!drupalBaseUrl || eventId == null) {
    return null
  }

  try {
    const response = await fetch(
      `${drupalBaseUrl}/api/conference-platform/events/${encodeURIComponent(
        String(eventId)
      )}/availability`,
      {
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return null
    }

    return (await response.json()) as EventAvailability
  } catch {
    return null
  }
}

export async function submitEventRegistrationToDrupal(
  eventId: number | string,
  payload: EventRegistrationRequest
): Promise<{
  body: EventRegistrationResponse | EventRegistrationError
  status: number
}> {
  const drupalBaseUrl = getDrupalBaseUrl()

  if (!drupalBaseUrl) {
    return {
      status: 503,
      body: {
        message: "Drupal is not configured for registrations.",
      },
    }
  }

  const response = await fetch(
    `${drupalBaseUrl}/api/conference-platform/events/${encodeURIComponent(
      String(eventId)
    )}/registrations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  )

  let body: EventRegistrationResponse | EventRegistrationError

  try {
    body = await response.json()
  } catch {
    body = {
      message: response.ok
        ? "Registration was submitted, but Drupal returned an unreadable response."
        : "Registration is unavailable right now.",
    }
  }

  return {
    body,
    status: response.status,
  }
}
