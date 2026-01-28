import Link from "next/link"
import { CheckCircle, Zap, Shield } from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent text-foreground">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 py-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Phase 2: Full-Stack Implementation</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Task Management
            <span className="block text-primary mt-2">Simplified</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Organize your work, track your progress, and achieve more with our intuitive task management platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-primary/25 button-hover btn-with-border"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-secondary hover:bg-secondary/80 text-secondary-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-all button-hover btn-with-border"
            >
              View Dashboard
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border card-hover">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <h3 className="font-semibold text-card-foreground">Simple & Fast</h3>
              <p className="text-sm text-muted-foreground text-center">Quick task creation and management</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border card-hover">
              <Zap className="w-8 h-8 text-yellow-500" />
              <h3 className="font-semibold text-card-foreground">Real-time Sync</h3>
              <p className="text-sm text-muted-foreground text-center">Stay updated across all devices</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border card-hover">
              <Shield className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-card-foreground">Secure</h3>
              <p className="text-sm text-muted-foreground text-center">Your data is safe and encrypted</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
