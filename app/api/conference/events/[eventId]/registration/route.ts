import { NextResponse } from "next/server"
import { submitEventRegistrationToDrupal } from "@/lib/conference"
import type { EventRegistrationRequest } from "@/lib/conference"

type RouteContext = {
  params: Promise<{
    eventId: string
  }>
}

export async function POST(request: Request, context: RouteContext) {
  const { eventId } = await context.params
  let payload: EventRegistrationRequest

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      {
        message: "Submit a valid registration request.",
      },
      {
        status: 400,
      }
    )
  }

  const result = await submitEventRegistrationToDrupal(eventId, payload)

  return NextResponse.json(result.body, {
    status: result.status,
  })
}
