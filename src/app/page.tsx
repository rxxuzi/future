"use client"

import { ArrowRight, Github } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { FutureLogo } from "@/components/FutureLogo"

const Hyperspeed = dynamic(() => import("@/components/Hyperspeed"), { ssr: false })

export default function LandingPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Hyperspeed Background */}
            <div className="fixed inset-0 z-0 opacity-30">
                <Hyperspeed
                    effectOptions={{
                        distortion: 'turbulentDistortion',
                        length: 400,
                        roadWidth: 10,
                        islandWidth: 2,
                        lanesPerRoad: 4,
                        fov: 90,
                        fovSpeedUp: 150,
                        speedUp: 2,
                        carLightsFade: 0.4,
                        totalSideLightSticks: 20,
                        lightPairsPerRoadWay: 40,
                        colors: {
                            roadColor: 0x080808,
                            islandColor: 0x0a0a0a,
                            background: 0x000000,
                            shoulderLines: 0x131318,
                            brokenLines: 0x131318,
                            leftCars: [0x22C55E, 0x16A34A, 0x15803D],
                            rightCars: [0xEF4444, 0xDC2626, 0xB91C1C],
                            sticks: 0x3B82F6,
                        }
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5">
                    <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
                        <div className="flex items-center justify-between h-20">
                            <Link href="/" className="flex items-center gap-3 group">
                                <FutureLogo size={28} className="transition-transform group-hover:scale-110" />
                                <span className="text-lg font-bold tracking-tight text-white">Future</span>
                            </Link>

                            <Link
                                href="/home"
                                className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all hover:scale-105"
                            >
                                Launch App
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="min-h-screen flex items-center justify-center px-8">
                    <div className="max-w-[1100px] mx-auto text-center">
                        {/* Main Headline */}
                        <h1 className="mb-10">
                            <div className="text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.95] tracking-tighter">
                                <span className="block text-white">Your Financial</span>
                                <span className="block bg-gradient-to-r from-accent via-blue-400 to-accent bg-clip-text text-transparent animate-gradient">
                  Future
                </span>
                                <span className="block text-white">Starts Here</span>
                            </div>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-white/50 font-light max-w-[800px] mx-auto mb-12 leading-relaxed">
                            Open-source portfolio management for individual investors.
                            <br />
                            Track, analyze, and grow your wealth with complete control.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/home"
                                className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black text-base font-bold hover:bg-white/90 transition-all hover:scale-105 shadow-2xl shadow-white/20"
                            >
                                Get Started
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href="https://github.com/rxxuzi/future"
                                className="inline-flex items-center gap-3 px-10 py-5 rounded-full border-2 border-white/20 text-white text-base font-bold hover:bg-white/10 transition-all hover:scale-105"
                            >
                                <Github className="w-5 h-5" />
                                View Source
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 px-8">
                    <div className="max-w-[1000px] mx-auto text-center">
                        <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black tracking-tighter text-white mb-8 leading-[1.1]">
                            Take Control of
                            <br />
                            Your Wealth Today
                        </h2>
                        <p className="text-xl text-white/50 font-light mb-12 max-w-[600px] mx-auto">
                            Free, open-source, and built by investors, for investors.
                        </p>
                        <Link
                            href="/home"
                            className="group inline-flex items-center gap-3 px-12 py-6 rounded-full bg-white text-black text-lg font-bold hover:bg-white/90 transition-all hover:scale-105 shadow-2xl shadow-white/20"
                        >
                            Start Building Your Future
                            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/5 py-12 px-8">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <FutureLogo size={24} />
                                <span className="text-sm font-bold text-white">Future</span>
                            </div>

                            <div className="flex items-center gap-8">
                                <Link href="https://github.com/rxxuzi/future" className="text-sm text-white/50 hover:text-white transition-colors">
                                    GitHub
                                </Link>
                                <Link href="/home" className="text-sm text-white/50 hover:text-white transition-colors">
                                    Dashboard
                                </Link>
                                <span className="text-sm text-white/30">Open Source</span>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-white/30">
                                © 2025 Future. Open-source personal finance management.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            <style jsx global>{`
              @keyframes gradient {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
              }
              .animate-gradient {
                background-size: 200% auto;
                animation: gradient 3s ease infinite;
              }
            `}</style>
        </div>
    )
}