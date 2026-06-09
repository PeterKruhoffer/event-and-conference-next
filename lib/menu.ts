type DrupalMenuApiItem = {
  id: string
  title: string
  description?: string
  url: string
  external?: boolean
  expanded?: boolean
  children?: DrupalMenuApiItem[]
}

type DrupalMenuApiResponse = {
  menu: string
  items: DrupalMenuApiItem[]
}

export type MenuItem = {
  id: string
  title: string
  description: string
  href: string
  external: boolean
  children: MenuItem[]
}

function normalizeHref(href: string, drupalBaseUrl: string) {
  if (href.startsWith("internal:")) {
    return href.replace(/^internal:/, "") || "/"
  }

  if (href.startsWith("/")) {
    return href
  }

  try {
    const url = new URL(href)
    const drupalUrl = new URL(drupalBaseUrl)

    if (url.origin === drupalUrl.origin) {
      return `${url.pathname}${url.search}${url.hash}`
    }
  } catch {
    return href
  }

  return href
}

function isExternalHref(href: string, drupalBaseUrl: string) {
  if (href.startsWith("/") || href.startsWith("internal:")) {
    return false
  }

  try {
    const url = new URL(href)
    const drupalUrl = new URL(drupalBaseUrl)

    return url.origin !== drupalUrl.origin
  } catch {
    return false
  }
}

function normalizeItems(
  items: DrupalMenuApiItem[],
  drupalBaseUrl: string
): MenuItem[] {
  return items
    .filter((item) => item.title && item.url)
    .map((item) => {
      const href = normalizeHref(item.url, drupalBaseUrl)

      return {
        id: item.id,
        title: item.title,
        description: item.description || "",
        href,
        external: item.external || isExternalHref(item.url, drupalBaseUrl),
        children: normalizeItems(item.children || [], drupalBaseUrl),
      }
    })
}

export async function getDrupalMenu(menuName = "main"): Promise<MenuItem[]> {
  const drupalBaseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

  if (!drupalBaseUrl) {
    return []
  }

  try {
    const response = await fetch(
      new URL(
        `/api/conference-platform/menu/${encodeURIComponent(menuName)}`,
        drupalBaseUrl
      ),
      {
        next: {
          revalidate: 3600,
        },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = (await response.json()) as DrupalMenuApiResponse
    return normalizeItems(data.items || [], drupalBaseUrl)
  } catch {
    return []
  }
}
