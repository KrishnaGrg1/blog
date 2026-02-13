import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Check,
  Edit,
  Image as ImageIcon,
  Users,
} from "lucide-react";
import { ModeToggle } from "@/components/toggle-mode";

export default function HomePage() {
  const features = [
    {
      icon: Edit,
      title: "Rich Text Editor",
      description: "Write and format your posts with an intuitive editor",
    },
    {
      icon: ImageIcon,
      title: "Image Upload",
      description: "Upload and manage images directly from Cloudinary",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your content is protected with enterprise-grade security",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built on Next.js 15 for optimal performance",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Account",
      description: "Sign up in seconds with your email",
    },
    {
      number: "02",
      title: "Write Content",
      description: "Use our editor to craft your stories",
    },
    {
      number: "03",
      title: "Publish & Share",
      description: "Share your thoughts with the world",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white dark:text-slate-900" />
              </div>
              <span className="text-xl font-bold">BlogHub</span>
            </div>

            <div className="flex items-center gap-4">
              <ModeToggle />
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <Badge variant="secondary" className="px-4 py-2 rounded-full">
                <Sparkles className="h-3 w-3 mr-2" />
                Built with Next.js 15 & Prisma
              </Badge>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Share Your Stories
                </span>
                <br />
                <span className="text-foreground">With the World</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A modern blogging platform designed for writers who want to
                focus on creating great content without the complexity.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="gap-2 shadow-lg">
                  Start Writing for Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline">
                  Explore Blogs
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>1000+ Writers</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>5000+ Articles</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>100% Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/10 to-transparent opacity-50 blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you create, manage, and share your
              content effortlessly.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Start in Minutes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting started with BlogHub is simple and straightforward.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="space-y-4">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 text-white dark:text-slate-900 font-bold text-xl shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Why Choose BlogHub?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We've built a platform that puts writers first. No distractions,
                no complexity—just you and your words.
              </p>
              <ul className="space-y-4">
                {[
                  "Clean, distraction-free writing environment",
                  "Automatic saving and version control",
                  "SEO-optimized blog posts",
                  "Mobile-responsive design",
                  "Analytics and insights",
                  "Community of writers",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <Card className="shadow-2xl">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300" />
                    <div>
                      <div className="font-semibold">John Doe</div>
                      <div className="text-sm text-muted-foreground">
                        Published 24 articles
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-secondary rounded w-3/4" />
                    <div className="h-4 bg-secondary rounded w-full" />
                    <div className="h-4 bg-secondary rounded w-5/6" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="h-24 bg-secondary rounded-lg" />
                    <div className="h-24 bg-secondary rounded-lg" />
                  </div>
                </CardContent>
              </Card>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className=" from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-950 shadow-2xl overflow-hidden relative border-0">
            <CardContent className="p-12 sm:p-16 text-center relative z-10">
              <div className="space-y-6 max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold ">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-lg ">
                  Join thousands of writers who are already sharing their
                  stories on BlogHub. It's free, forever.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      className="bg-white text-slate-900 hover:bg-slate-100 gap-2"
                    >
                      Create Your Account
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/blog">
                    <Button size="lg" variant="outline">
                      Browse Articles
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white dark:text-slate-900" />
                </div>
                <span className="font-bold">BlogHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A modern platform for writers to share their stories with the
                world.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="hover:text-foreground transition-colors"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} BlogHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
