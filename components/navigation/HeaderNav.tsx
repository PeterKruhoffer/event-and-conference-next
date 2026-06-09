import { Link } from "@/components/navigation/Link"
import { getDrupalMenu, type MenuItem } from "@/lib/menu"

function HeaderNavLink({ item }: { item: MenuItem }) {
  return (
    <Link
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "external noopener noreferrer" : undefined}
      className="hover:text-blue-600"
    >
      {item.title}
    </Link>
  )
}

export async function HeaderNav() {
  const menuItems = await getDrupalMenu("main")

  return (
    <header>
      <div className="container flex items-center justify-between py-6 mx-auto">
        <Link href="/" className="text-2xl font-semibold no-underline">
          Next.js for Drupal
        </Link>
        <nav className="flex items-center gap-6">
          {menuItems.map((item) => (
            <HeaderNavLink key={item.id} item={item} />
          ))}
        </nav>
      </div>
    </header>
  )
}
