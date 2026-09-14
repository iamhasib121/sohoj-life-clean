import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sohoj Life - Premium Store",
  description: "Easy shopping for lifestyle products",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
