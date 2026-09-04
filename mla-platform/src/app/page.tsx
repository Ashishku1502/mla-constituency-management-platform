"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  Network, 
  Users, 
  Activity, 
  Shield, 
  ChevronRight,
  ArrowRight,
  BarChart4,
  Map,
  MessageSquare,
  Menu
} from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans selection:bg-primary/30">
      {/* Decorative Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-pulse duration-10000" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-pulse duration-7000 delay-1000" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl transition-all">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center group cursor-pointer">
            <div className="bg-white/95 px-3 py-1.5 rounded-xl shadow-lg shadow-white/5 transition-all duration-300 hover:scale-105 border border-white/20">
              <Image 
                src="/pmp-logo.png" 
                alt="PMP Consultancy Logo" 
                width={110} 
                height={40} 
                className="object-contain h-10 w-auto"
                priority
              />
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/login">
              <Button variant="ghost" className="font-semibold text-slate-300 hover:text-white hover:bg-white/10 text-base">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="font-semibold border-primary/50 text-primary hover:bg-primary/10 transition-all text-base">Sign Up</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="font-semibold bg-gradient-to-r from-primary to-blue-600 text-white border-0 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:scale-105 transition-all duration-300 text-base px-6">
                Dashboard <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl absolute top-20 left-0 w-full p-4 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-center font-semibold text-slate-300 text-lg h-12">Login</Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center font-semibold border-primary/50 text-primary text-lg h-12">Sign Up</Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center font-semibold bg-gradient-to-r from-primary to-blue-600 text-white border-0 text-lg h-12">
                Enter Dashboard
              </Button>
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <div className={`transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(37,99,235,0.15)]">
                <span className="relative flex h-2.5 w-2.5 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                The Next-Gen Constituency Management Hub
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 max-w-5xl mx-auto leading-[1.1]">
                Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-purple-500 animate-gradient-x">Modern Leaders</span> <br className="hidden md:block"/> with Smart Tools.
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Streamline your campaign, mobilize your volunteers, and connect with your voters at an unprecedented scale through our comprehensive digital war room.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/dashboard">
                  <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 w-full sm:w-auto rounded-xl">
                    Enter War Room <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/academy">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold w-full sm:w-auto border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-300">
                    Explore Academy
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview / Mockup Section */}
        <section className="py-10 relative">
          <div className="container mx-auto px-4">
            <div className={`relative max-w-6xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-1000 delay-300 transform ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80 z-10 pointer-events-none" />
              <img 
                src="/dashboard_mockup.jpg" 
                alt="Platform Dashboard Preview" 
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
          </div>
        </section>

        {/* Impact Statistics */}
        <section className="py-16 border-y border-white/5 bg-slate-900/50 backdrop-blur-sm relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
              <div className="p-4">
                <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">1,200+</div>
                <div className="text-sm md:text-base text-slate-400 font-medium tracking-wide uppercase">Active Wards</div>
              </div>
              <div className="p-4">
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 mb-2 tracking-tighter">15K+</div>
                <div className="text-sm md:text-base text-slate-400 font-medium tracking-wide uppercase">Volunteers Mobilized</div>
              </div>
              <div className="p-4">
                <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">98%</div>
                <div className="text-sm md:text-base text-slate-400 font-medium tracking-wide uppercase">Issue Resolution</div>
              </div>
              <div className="p-4">
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-primary mb-2 tracking-tighter">2.5M</div>
                <div className="text-sm md:text-base text-slate-400 font-medium tracking-wide uppercase">Voter Data Points</div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features Section */}
        <section className="py-32 relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">Everything you need to win</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                Purpose-built modules wrapped in a stunning interface to give you complete visibility and control over your constituency.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              
              {/* Feature 1: Digital War Room (Wide - span 2 or 3) */}
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl hover:bg-slate-800/80 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_40px_-15px_rgba(37,99,235,0.4)] md:col-span-2 lg:col-span-2 flex flex-col justify-between min-h-[360px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:bg-primary/30 transition-colors duration-700" />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/30">
                    <Activity className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-white tracking-tight">Digital War Room</h3>
                  <p className="text-slate-400 leading-relaxed max-w-sm">
                    Command central. Real-time monitoring of campaign activities, sentiment analysis, and immediate issue resolution.
                  </p>
                </div>
                {/* Rich Mock UI Element - Digital War Room */}
                <div className="relative mt-8 -mx-4 -mb-8 h-40 overflow-hidden rounded-t-xl border border-white/10 bg-slate-950 shadow-2xl transform group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />
                  
                  {/* Fake Window Header */}
                  <div className="flex gap-2 p-3 border-b border-white/5 bg-slate-900">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="p-4 grid grid-cols-4 gap-3 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                    {/* Main Chart Area */}
                    <div className="col-span-3 flex flex-col gap-2">
                      <div className="flex gap-2">
                        <div className="h-16 w-full rounded-lg bg-gradient-to-tr from-primary/20 to-blue-600/10 border border-primary/20 relative overflow-hidden">
                          {/* Animated line chart SVG mockup */}
                          <svg className="absolute bottom-0 w-full h-12 text-primary/40 stroke-current group-hover:animate-pulse" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
                            <path d="M0,100 L0,80 C20,80 30,30 50,40 C70,50 80,10 100,20 L100,100 Z" fill="currentColor" opacity="0.2" />
                            <path d="M0,80 C20,80 30,30 50,40 C70,50 80,10 100,20" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                          </svg>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-10 rounded-md bg-slate-800/80 border border-white/5" />
                        <div className="h-10 rounded-md bg-slate-800/80 border border-white/5" />
                        <div className="h-10 rounded-md bg-slate-800/80 border border-white/5" />
                      </div>
                    </div>
                    {/* Sidebar Stats */}
                    <div className="col-span-1 flex flex-col gap-2">
                      <div className="h-8 rounded-md bg-emerald-500/20 border border-emerald-500/30" />
                      <div className="h-8 rounded-md bg-rose-500/20 border border-rose-500/30" />
                      <div className="h-8 rounded-md bg-amber-500/20 border border-amber-500/30" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2: Predictive Analytics (Tall - span 1) */}
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl hover:bg-slate-800/80 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-15px_rgba(168,85,247,0.4)] md:col-span-1 lg:col-span-1 flex flex-col justify-between">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors duration-700" />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30">
                    <BarChart4 className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white tracking-tight">Predictive Analytics</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    Turn data into decisions. Visualize sentiment trends and optimize resource allocation instantly.
                  </p>
                </div>
                {/* Rich Mock UI Element - Predictive Analytics */}
                <div className="relative mt-6 -mx-4 -mb-8 h-32 overflow-hidden border-t border-white/10 bg-slate-900/50 transform group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none" />
                  <div className="absolute bottom-0 w-full h-full flex items-end justify-between px-4 pb-2 opacity-70 group-hover:opacity-100 gap-1">
                    <div className="w-full bg-purple-500/20 rounded-t-sm transition-all duration-700" style={{ height: '30%' }} />
                    <div className="w-full bg-purple-500/30 rounded-t-sm transition-all duration-700 delay-75" style={{ height: '45%' }} />
                    <div className="w-full bg-purple-500/40 rounded-t-sm transition-all duration-700 delay-100 group-hover:h-[65%]" style={{ height: '55%' }} />
                    <div className="w-full bg-purple-500/50 rounded-t-sm transition-all duration-700 delay-150 group-hover:h-[80%]" style={{ height: '60%' }} />
                    <div className="w-full bg-purple-500/70 rounded-t-sm transition-all duration-700 delay-200 group-hover:h-[95%]" style={{ height: '75%' }} />
                  </div>
                </div>
              </div>

              {/* Feature 3: Micro-Targeting (Standard - span 1) */}
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl hover:bg-slate-800/80 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-15px_rgba(6,182,212,0.4)] md:col-span-1 lg:col-span-1">
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30">
                    <Map className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white tracking-tight">Micro-Targeting</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    Map demographics and deploy hyper-local strategies directly to polling stations.
                  </p>
                </div>
                {/* Rich Mock UI Element - Micro Targeting */}
                <div className="relative mt-6 -mx-4 -mb-8 h-32 overflow-hidden border-t border-white/10 bg-slate-900/50 transform group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500 flex items-center justify-center">
                  <div className="absolute inset-0 bg-slate-950/50 z-10 pointer-events-none" />
                  {/* Simulated Map Background */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '16px 16px'
                  }} />
                  {/* Pulsing Dots */}
                  <div className="relative z-20 w-full h-full">
                    <span className="absolute top-1/4 left-1/4 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
                    </span>
                    <span className="absolute top-1/2 right-1/3 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 delay-300"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="absolute bottom-1/4 right-1/4 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 delay-700"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-primary shadow-[0_0_15px_rgba(37,99,235,0.8)]"></span>
                    </span>
                  </div>
                </div>
              </div>



            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 relative z-10 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="mb-6 inline-block bg-white/95 px-4 py-2 rounded-xl shadow-lg border border-white/20">
                <Image 
                  src="/pmp-logo.png" 
                  alt="PMP Consultancy Logo" 
                  width={140} 
                  height={50} 
                  className="object-contain h-12 w-auto"
                />
              </div>
              <p className="text-slate-400 max-w-md leading-relaxed">
                The ultimate operating system for modern political campaigns and constituency management. Built for leaders who demand scale and precision.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Platform</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="/academy" className="hover:text-primary transition-colors">Training Academy</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link href="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Constituency Management Platform. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span>Secure & Encrypted</span>
              <Shield className="h-4 w-4 text-slate-500" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
