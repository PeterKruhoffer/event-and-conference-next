export function formatDate(input: string): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function formatDateTime(input: string): string {
  const date = new Date(input)
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function formatDateTimeRange(start?: string, end?: string): string {
  if (!start && !end) {
    return ""
  }

  if (!start) {
    return formatDateTime(end!)
  }

  if (!end) {
    return formatDateTime(start)
  }

  const startDate = new Date(start)
  const endDate = new Date(end)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return `${formatDateTime(start)} - ${formatDateTime(end)}`
  }

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

  if (dateFormatter.format(startDate) === dateFormatter.format(endDate)) {
    return `${dateFormatter.format(startDate)}, ${timeFormatter.format(
      startDate
    )} - ${timeFormatter.format(endDate)}`
  }

  return `${dateFormatter.format(startDate)}, ${timeFormatter.format(
    startDate
  )} - ${dateFormatter.format(endDate)}, ${timeFormatter.format(endDate)}`
}

export function formatTimeUntil(input: string): string {
  const date = new Date(input)
  const diffInMs = date.getTime() - Date.now()

  if (Number.isNaN(diffInMs)) {
    return ""
  }

  if (diffInMs <= 0) {
    return "Signup deadline passed"
  }

  const diffInMinutes = Math.ceil(diffInMs / (1000 * 60))

  if (diffInMinutes < 60) {
    return `in ${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"}`
  }

  const diffInHours = Math.ceil(diffInMinutes / 60)

  if (diffInHours < 24) {
    return `in ${diffInHours} hour${diffInHours === 1 ? "" : "s"}`
  }

  const diffInDays = Math.ceil(diffInHours / 24)

  return `in ${diffInDays} day${diffInDays === 1 ? "" : "s"}`
}

export function absoluteUrl(input: string) {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

  if (!baseUrl) {
    return input
  }

  return new URL(input, baseUrl).toString()
}
