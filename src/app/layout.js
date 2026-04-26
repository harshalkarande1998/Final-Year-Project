import { Providers } from "@/components/Providers"
import "./globals.css"

export const metadata = {
  title: "LocalSwig - Food & Grocery Delivery",
  description: "Order food from local restaurants or shop fresh groceries with LocalSwig",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
