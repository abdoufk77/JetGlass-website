import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - JetGlass',
  description: 'Administration JetGlass',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
