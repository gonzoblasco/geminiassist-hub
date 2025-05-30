import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Zap className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-semibold font-headline">GeminiAssist Hub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/#features"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Pricing
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/login?signup=true">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                    Unlock Your Business Potential with AI Agents
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    GeminiAssist Hub provides intelligent agents powered by Gemini to automate tasks, streamline workflows, and boost productivity for small businesses and entrepreneurs.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login?signup=true">
                      Start Your Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="AI Agent Showcase"
                data-ai-hint="abstract technology"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Everything You Need, Nothing You Don&apos;t
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is designed to be intuitive and powerful, helping you leverage AI without the complexity.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              {[
                { title: "Conversational Onboarding", description: "Get started quickly with a guided, AI-powered onboarding experience.", icon: "MessagesSquare" },
                { title: "Agent Catalog", description: "Discover a wide range of AI agents for various business tasks.", icon: "LayoutGrid" },
                { title: "Chat & Form Interaction", description: "Interact with agents through intuitive chat interfaces or structured forms.", icon: "Terminal" },
                { title: "Free Trials", description: "Test out agents with a 1-week free trial before committing.", icon: "CalendarClock" },
                { title: "Smart Feedback", description: "Provide feedback that helps us (and our AI) improve agent performance.", icon: "Star" },
                { title: "Secure & Scalable", description: "Built on robust Firebase infrastructure for reliability and growth.", icon: "ShieldCheck" },
              ].map(feature => {
                const Icon = require('lucide-react')[feature.icon] || Zap;
                return (
                  <div key={feature.title} className="grid gap-1 p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2">
                       <Icon className="h-8 w-8 text-primary" />
                       <h3 className="text-xl font-bold font-headline">{feature.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Simple Pricing for Every Business
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose a plan that fits your needs. Start with a free trial on any agent.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              {/* Pricing cards will go here - for now, a placeholder message */}
               <p className="text-lg font-medium">Flexible subscription options coming soon!</p>
              <Button asChild size="lg" className="w-full mt-4">
                <Link href="/login?signup=true">
                  Explore Agents & Start Trial
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} GeminiAssist Hub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
