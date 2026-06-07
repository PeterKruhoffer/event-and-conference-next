import { formatTimeUntil } from "@/lib/utils"

const eventTypeStyles: Record<string, string> = {
  conference: "border-blue-200 bg-blue-50 text-blue-700",
  event: "border-amber-200 bg-amber-50 text-amber-700",
  network: "border-emerald-200 bg-emerald-50 text-emerald-700",
}

export function getEventTypeClass(eventType: string) {
  return (
    eventTypeStyles[eventType.toLowerCase()] ||
    "border-gray-200 bg-gray-50 text-gray-700"
  )
}

export function formatEventType(eventType: string) {
  return eventType.charAt(0).toUpperCase() + eventType.slice(1)
}

function getCapacityText(capacity: number | string) {
  return `${capacity} ${Number(capacity) === 1 ? "seat" : "seats"}`
}

function getSignupText(signupDeadline: string) {
  const timeUntilSignup = formatTimeUntil(signupDeadline)

  if (!timeUntilSignup) {
    return null
  }

  return timeUntilSignup === "Signup deadline passed"
    ? timeUntilSignup
    : `Signup closes ${timeUntilSignup}`
}

export function getEventDetailText({
  location,
  capacity,
  signupDeadline,
}: {
  location?: string
  capacity?: number | string
  signupDeadline?: string
}) {
  const placeAndCapacity = [
    location,
    capacity != null ? getCapacityText(capacity) : null,
  ]
    .filter(Boolean)
    .join(" with ")
  const signupText = signupDeadline ? getSignupText(signupDeadline) : null

  return [placeAndCapacity, signupText].filter(Boolean).join(". ")
}

export function isMultiDayEvent(start?: string, end?: string) {
  if (!start || !end) {
    return false
  }

  const startDate = new Date(start)
  const endDate = new Date(end)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return false
  }

  return startDate.toDateString() !== endDate.toDateString()
}
