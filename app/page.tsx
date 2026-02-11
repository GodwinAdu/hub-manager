'use client'

import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight, Check, Star, Zap, Shield, BarChart3, Workflow, Users, Lock } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: Lock,
      title: 'Role & Permission Control',
      description: 'Granular access control with customizable roles and permissions for every module',
      color: 'from-purple-500 to-blue-500',
    },
    {
      icon: Workflow,
      title: 'Workflow Automation',
      description: 'Automate routine tasks and build complex workflows without coding',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Real-time dashboards and detailed reports across all modules',
      color: 'from-cyan-500 to-teal-500',
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Enterprise-grade security with complete audit logs and compliance tracking',
      color: 'from-teal-500 to-green-500',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless collaboration tools built for modern teams and organizations',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Zap,
      title: 'Lightning Fast Performance',
      description: 'Optimized for speed with sub-second response times and 99.9% uptime',
      color: 'from-emerald-500 to-cyan-500',
    },
  ]

  const modules = [
    { title: 'HR & Payroll', icon: '👥', gradient: 'from-purple-600 to-pink-600' },
    { title: 'Academics', icon: '🎓', gradient: 'from-blue-600 to-purple-600' },
    { title: 'Finance', icon: '💰', gradient: 'from-cyan-600 to-blue-600' },
    { title: 'Inventory', icon: '📦', gradient: 'from-teal-600 to-cyan-600' },
    { title: 'Communication', icon: '💬', gradient: 'from-green-600 to-teal-600' },
    { title: 'Health Center', icon: '⚕️', gradient: 'from-emerald-600 to-green-600' },
  ]

  const steps = [
    {
      number: '01',
      title: 'Create Your Organization',
      description: 'Set up your organization in minutes with our intuitive setup wizard',
    },
    {
      number: '02',
      title: 'Enable Modules',
      description: 'Choose and enable the modules that fit your organization\'s needs',
    },
    {
      number: '03',
      title: 'Start Managing',
      description: 'Invite team members, assign roles, and start managing seamlessly',
    },
  ]

  const pricingTiers = [
    {
      name: 'Starter',
      price: '$29',
      description: 'Perfect for small teams',
      features: ['Up to 10 users', '2 modules included', 'Basic analytics', 'Email support'],
      popular: false,
    },
    {
      name: 'Professional',
      price: '$99',
      description: 'For growing organizations',
      features: ['Up to 100 users', 'All 6 modules', 'Advanced analytics', 'Priority support', 'Custom workflows'],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: ['Unlimited users', 'Custom modules', 'Dedicated support', 'SLA guarantee', 'On-premise option'],
      popular: false,
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Operations Director',
      company: 'TechCorp',
      text: 'Hub Manager transformed how we manage our organization. We cut operational overhead by 40%.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'HR Manager',
      company: 'Global Solutions Inc',
      text: 'The automation features alone have saved us countless hours every week. Incredible platform.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Finance Lead',
      company: 'Growth Ventures',
      text: 'From HR to Finance, everything works seamlessly. Best investment for our organization.',
      rating: 5,
    },
  ]

  const faqs = [
    {
      question: 'Is Hub Manager secure for sensitive data?',
      answer: 'Yes, Hub Manager uses enterprise-grade encryption, SSL/TLS protocols, and regular security audits. We comply with GDPR, SOC 2, and ISO 27001 standards.',
    },
    {
      question: 'Can we migrate from our existing system?',
      answer: 'Absolutely. We provide comprehensive migration support with dedicated team assistance to ensure a smooth transition with zero data loss.',
    },
    {
      question: 'What if we need custom workflows?',
      answer: 'Hub Manager includes a visual workflow builder for custom automation. For advanced needs, our API and webhook support enable infinite customization.',
    },
    {
      question: 'How does pricing scale with our organization?',
      answer: 'Our pricing scales based on users and modules. You only pay for what you use, and can upgrade anytime as your organization grows.',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-float opacity-40"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/40 shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold text-xl">H</div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Hub Manager</span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#modules" className="hover:text-primary transition-colors">Modules</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex gap-4">
            <Link  href="/sign-in" className={cn(buttonVariants({variant:"ghost"}))}>Log In</Link>
            <Link  href="/sign-up" className={cn(buttonVariants({variant:"default"}))}>Get Started</Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden animate-fadeInUp bg-background/95 backdrop-blur-md border-b border-border/40 px-4 py-4 space-y-4">
            <a href="#features" className="block hover:text-primary">Features</a>
            <a href="#modules" className="block hover:text-primary">Modules</a>
            <a href="#pricing" className="block hover:text-primary">Pricing</a>
            <a href="#faq" className="block hover:text-primary">FAQ</a>
            <Button className="w-full bg-gradient-to-r from-primary to-accent">Get Started</Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slideInLeft space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 backdrop-blur border border-primary/20 rounded-full hover:bg-secondary/80 transition-colors">
              <Zap size={16} className="text-primary" />
              <span className="text-sm font-medium">Unified Organization Management</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Run Your Organization
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradientShift"> From One Smart Hub</span>
              </h1>
              <p className="text-xl text-foreground/70 max-w-lg">
                Unified platform for HR, Finance, Academics, Inventory, and more. Streamline workflows and manage everything seamlessly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg h-14 px-8">
                Start Free Trial
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 hover:bg-secondary bg-transparent">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-border/40">
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-foreground/60">Organizations</div>
              </div>
              <div>
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm text-foreground/60">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-foreground/60">Uptime</div>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="animate-slideInRight relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 opacity-50">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent animate-shimmer"></div>
              </div>
              <div className="relative p-8 h-full flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary/40"></div>
                  <div className="w-3 h-3 rounded-full bg-accent/40"></div>
                  <div className="w-3 h-3 rounded-full bg-primary/20"></div>
                </div>
                <div className="flex-1 space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-3 bg-primary/10 rounded-full w-3/4 animate-shimmer" style={{ animationDelay: `${i * 200}ms` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">Everything you need to manage your organization efficiently</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="group p-8 bg-card/50 backdrop-blur border border-primary/10 hover:border-primary/40 transition-all duration-500 cursor-pointer hover:shadow-lg hover:shadow-primary/20 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-foreground/60">{feature.description}</p>
                {hoveredFeature === index && (
                  <div className="mt-6 flex items-center gap-2 text-primary font-semibold animate-slideInRight">
                    Learn more <ArrowRight size={16} />
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">All Modules in One Place</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">Comprehensive solutions for every aspect of your organization</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <Card
              key={index}
              className="group p-8 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur border border-primary/10 hover:border-primary/40 transition-all duration-500 cursor-pointer animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${module.gradient} rounded-xl flex items-center justify-center mb-6 text-5xl group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/20`}>
                {module.icon}
              </div>
              <h3 className="text-2xl font-bold">{module.title}</h3>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-foreground/60 text-sm mb-4">Comprehensive tools and features</p>
                <Button variant="ghost" size="sm" className="text-primary">
                  Explore <ArrowRight size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">Get started in three simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg shadow-primary/30">
                  {step.number}
                </div>
                <Card className="p-8 bg-card/50 backdrop-blur border border-primary/10 text-center">
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-foreground/60">{step.description}</p>
                </Card>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-24 -right-4 w-8 h-1 bg-gradient-to-r from-primary to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">Choose the perfect plan for your organization</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <Card
              key={index}
              className={`relative p-8 animate-fadeInUp transition-all duration-500 ${tier.popular ? 'md:scale-105 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/40 shadow-2xl shadow-primary/20' : 'bg-card/50 backdrop-blur border border-primary/10'}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <p className="text-foreground/60 mb-6">{tier.description}</p>

              <div className="mb-8">
                <span className="text-5xl font-bold">{tier.price}</span>
                {tier.price !== 'Custom' && <span className="text-foreground/60">/month</span>}
              </div>

              <Button
                className="w-full mb-8 h-12"
                variant={tier.popular ? 'default' : 'outline'}
                size="lg"
              >
                {tier.popular ? (
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Get Started</span>
                ) : (
                  'Get Started'
                )}
              </Button>

              <div className="space-y-4">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check size={20} className="text-accent flex-shrink-0" />
                    <span className="text-foreground/70">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Organizations</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">See what customers are saying</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-8 bg-card/50 backdrop-blur border border-primary/10 hover:border-primary/40 transition-all duration-500 animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground/70 mb-6 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-foreground/60">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-foreground/60">Have questions? We have answers</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="border border-primary/10 px-6 rounded-lg bg-card/50 backdrop-blur hover:border-primary/40 transition-colors animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <AccordionTrigger className="font-semibold text-lg hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/70">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-40 h-40 bg-primary/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent/30 rounded-full blur-3xl"></div>
            </div>
          </div>

          <div className="relative p-16 md:p-20 text-center border border-primary/20 backdrop-blur">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Organization?</h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">Join 500+ organizations already using Hub Manager to streamline their operations</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg h-14 px-8">
                Start Free Trial
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 bg-transparent">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold">H</div>
                <span className="font-bold text-lg">Hub Manager</span>
              </div>
              <p className="text-foreground/60">Unified organization management platform</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-foreground/60">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Modules</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-foreground/60">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-foreground/60">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center text-foreground/60 text-sm">
            <p>&copy; 2024 Hub Manager. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
