import { Geist, Geist_Mono } from "next/font/google"

import { Toaster } from "@workspace/ui/components/sonner"
import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"
import { Providers } from "@/components/providers"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body className="min-h-screen w-full bg-background font-sans text-foreground antialiased">
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  )
}
