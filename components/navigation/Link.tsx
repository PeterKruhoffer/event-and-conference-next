import { forwardRef } from "react"
import NextLink from "next/link"
import type { AnchorHTMLAttributes, ReactNode } from "react"
import type { LinkProps as NextLinkProps } from "next/link"

type LinkProps = NextLinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> & {
    children?: ReactNode
  }

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  function LinkWithRef(props, ref) {
    return <NextLink {...props} ref={ref} />
  }
)
