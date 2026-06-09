"use client"

import { useMemo, useState } from "react"
import { formatDateTime } from "@/lib/utils"
import type {
  EventAvailability,
  EventRegistrationError,
  EventRegistrationRequest,
  EventRegistrationResponse,
} from "@/lib/conference"
import type { FormEvent } from "react"

type EventRegistrationFormProps = {
  availability: EventAvailability | null
  eventId: number
  eventTitle: string
}

type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; data: EventRegistrationResponse }
  | { status: "error"; data: EventRegistrationError }

const inputClassName =
  "mt-2 w-full rounded border border-gray-300 px-3 py-2 text-base text-gray-950 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
const labelClassName = "block text-sm font-semibold text-gray-950"

function isRegistrationResponse(
  value: EventRegistrationResponse | EventRegistrationError
): value is EventRegistrationResponse {
  return "registrationId" in value && "status" in value
}

function getAvailabilityText(availability: EventAvailability | null) {
  if (!availability) {
    return "Registration is unavailable until the Drupal conference API is enabled."
  }

  if (availability.state === "closed") {
    return availability.signupDeadline
      ? `Registration closed on ${formatDateTime(availability.signupDeadline)}.`
      : "Registration is closed."
  }

  if (availability.state === "waitlist") {
    const waitlistText = availability.nextWaitlistPosition
      ? ` Next waitlist position is ${availability.nextWaitlistPosition}.`
      : ""

    return `All seats are currently filled. New registrations will join the waitlist.${waitlistText}`
  }

  if (availability.capacity == null || availability.openSeats == null) {
    return "Registration is open."
  }

  return `${availability.openSeats} of ${availability.capacity} ${
    availability.capacity === 1 ? "seat is" : "seats are"
  } available.`
}

function getPrimaryActionLabel(
  availability: EventAvailability | null,
  submissionState: SubmissionState
) {
  if (submissionState.status === "submitting") {
    return "Submitting"
  }

  if (availability?.state === "waitlist") {
    return "Join waitlist"
  }

  return "Register"
}

function getSuccessTitle(response: EventRegistrationResponse) {
  if (response.status === "waitlisted") {
    return response.existing ? "You are on the waitlist" : "Waitlist spot held"
  }

  return response.existing
    ? "You are already registered"
    : "Registration accepted"
}

function getSuccessText(response: EventRegistrationResponse) {
  if (response.status === "waitlisted") {
    return response.waitlistPosition
      ? `Your waitlist position is ${response.waitlistPosition}.`
      : "Drupal added this registration to the event waitlist."
  }

  return "Drupal accepted this registration for the event."
}

function formDataToPayload(formData: FormData): EventRegistrationRequest {
  return {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    organization: String(formData.get("organization") || "").trim(),
    dietaryRequirements: String(
      formData.get("dietaryRequirements") || ""
    ).trim(),
    notes: String(formData.get("notes") || "").trim(),
  }
}

export function EventRegistrationForm({
  availability,
  eventId,
  eventTitle,
}: EventRegistrationFormProps) {
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    status: "idle",
  })
  const currentAvailability =
    submissionState.status === "success" || submissionState.status === "error"
      ? submissionState.data.availability || availability
      : availability
  const isDisabled =
    !availability ||
    availability.state === "closed" ||
    submissionState.status === "submitting" ||
    submissionState.status === "success"
  const fieldErrors =
    submissionState.status === "error" ? submissionState.data.errors || {} : {}
  const availabilityText = useMemo(
    () => getAvailabilityText(currentAvailability),
    [currentAvailability]
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isDisabled) {
      return
    }

    setSubmissionState({ status: "submitting" })

    try {
      const response = await fetch(
        `/api/conference/events/${eventId}/registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            formDataToPayload(new FormData(event.currentTarget))
          ),
        }
      )
      const data = (await response.json()) as
        | EventRegistrationResponse
        | EventRegistrationError

      if (!response.ok || !isRegistrationResponse(data)) {
        setSubmissionState({
          status: "error",
          data: {
            message:
              "message" in data
                ? data.message
                : "Registration could not be submitted.",
            errors: "errors" in data ? data.errors : undefined,
            availability:
              "availability" in data ? data.availability : undefined,
          },
        })
        return
      }

      setSubmissionState({ status: "success", data })
    } catch {
      setSubmissionState({
        status: "error",
        data: {
          message: "Registration could not be submitted right now.",
        },
      })
    }
  }

  return (
    <section
      aria-labelledby="event-registration-heading"
      className="my-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5 flex flex-col gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="event-registration-heading"
            className="text-2xl font-bold text-gray-950"
          >
            Register for this event
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-gray-700">
            {availabilityText}
          </p>
        </div>
        {currentAvailability?.waitlistCount ? (
          <div className="shrink-0 rounded border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700">
            {currentAvailability.waitlistCount} waiting
          </div>
        ) : null}
      </div>

      {submissionState.status === "success" && (
        <div
          className="mb-5 rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900"
          role="status"
        >
          <p className="font-semibold">
            {getSuccessTitle(submissionState.data)}
          </p>
          <p className="mt-1 text-sm">{getSuccessText(submissionState.data)}</p>
        </div>
      )}

      {submissionState.status === "error" && (
        <div
          className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-900"
          role="alert"
        >
          <p className="font-semibold">{submissionState.data.message}</p>
        </div>
      )}

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClassName}>
            Name
            <input
              aria-describedby={
                fieldErrors.name ? "registration-name-error" : undefined
              }
              className={inputClassName}
              disabled={isDisabled}
              name="name"
              required
              type="text"
            />
            {fieldErrors.name && (
              <span
                className="mt-1 block text-sm font-medium text-red-700"
                id="registration-name-error"
              >
                {fieldErrors.name}
              </span>
            )}
          </label>

          <label className={labelClassName}>
            Email
            <input
              aria-describedby={
                fieldErrors.email ? "registration-email-error" : undefined
              }
              className={inputClassName}
              disabled={isDisabled}
              name="email"
              required
              type="email"
            />
            {fieldErrors.email && (
              <span
                className="mt-1 block text-sm font-medium text-red-700"
                id="registration-email-error"
              >
                {fieldErrors.email}
              </span>
            )}
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClassName}>
            Organization
            <input
              className={inputClassName}
              disabled={isDisabled}
              name="organization"
              type="text"
            />
          </label>

          <label className={labelClassName}>
            Phone
            <input
              className={inputClassName}
              disabled={isDisabled}
              name="phone"
              type="tel"
            />
          </label>
        </div>

        <label className={labelClassName}>
          Dietary requirements
          <textarea
            className={inputClassName}
            disabled={isDisabled}
            name="dietaryRequirements"
            rows={3}
          />
        </label>

        <label className={labelClassName}>
          Notes
          <textarea
            className={inputClassName}
            disabled={isDisabled}
            name="notes"
            rows={3}
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            className="inline-flex min-h-11 items-center justify-center rounded bg-blue-600 px-5 py-2 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
            disabled={isDisabled}
            type="submit"
          >
            {getPrimaryActionLabel(availability, submissionState)}
          </button>
          <p className="text-sm text-gray-600">{eventTitle}</p>
        </div>
      </form>
    </section>
  )
}
