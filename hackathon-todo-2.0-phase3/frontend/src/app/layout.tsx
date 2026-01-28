import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import ChatWidget from "@/components/ChatWidget"
import { TaskProvider } from "@/context/TaskContext" // 👈 New Import

export const metadata: Metadata = {
  title: "TaskFlow - Task Management Simplified",
  description: "Organize your work, track your progress, and achieve more with our intuitive task management platform.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        {/* 👇 Context Provider Added */}
        <TaskProvider>
          <ThemeProvider>
            {children}
            <ChatWidget />
            <Analytics />
          </ThemeProvider>
        </TaskProvider>
      </body>
    </html>
  )
}
