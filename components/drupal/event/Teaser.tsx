import type { ComponentPropsWithoutRef, ReactNode } from "react"

type TeaserRootProps = ComponentPropsWithoutRef<"article"> & {
  children: ReactNode
}

type TeaserChildrenProps = {
  children: ReactNode
}

function TeaserRoot({ children, className, ...props }: TeaserRootProps) {
  return (
    <article
      {...props}
      className={["group py-2 transition", className].filter(Boolean).join(" ")}
    >
      {children}
    </article>
  )
}

function TeaserBadges({ children }: TeaserChildrenProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-3">{children}</div>
  )
}

function TeaserBadge({
  children,
  className = "",
}: TeaserChildrenProps & { className?: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${className}`}
    >
      {children}
    </span>
  )
}

function TeaserDate({ children }: TeaserChildrenProps) {
  return <p className="mb-5 text-lg font-semibold text-gray-900">{children}</p>
}

function TeaserTitle({ children }: TeaserChildrenProps) {
  return (
    <h2 className="mb-4 max-w-4xl text-4xl font-bold leading-tight group-hover:underline">
      {children}
    </h2>
  )
}

function TeaserDetails({ children }: TeaserChildrenProps) {
  return (
    <p className="max-w-4xl text-xl leading-relaxed text-gray-700">
      {children}
    </p>
  )
}

export const Teaser = Object.assign(TeaserRoot, {
  Badges: TeaserBadges,
  Badge: TeaserBadge,
  Date: TeaserDate,
  Title: TeaserTitle,
  Details: TeaserDetails,
})
