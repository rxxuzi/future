"use client"

import { TrendingUp, Home, Activity, BarChart3, Settings, Moon, Sun, Bell, User, Shield } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function SettingsPage() {
    const [theme, setTheme] = useState<"light" | "dark">("dark")
    const [notifications, setNotifications] = useState(true)
    const [twoFactor, setTwoFactor] = useState(false)

    const navigation = [
        { name: "Overview", icon: Home, href: "/", active: false },
        { name: "Transactions", icon: Activity, href: "/transactions", active: false },
        { name: "Portfolio", icon: TrendingUp, href: "/portfolio", active: false },
        { name: "Analytics", icon: BarChart3, href: "/analytics", active: false },
        { name: "Settings", icon: Settings, href: "/settings", active: true },
    ]

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
        if (savedTheme) {
            setTheme(savedTheme)
            document.documentElement.classList.toggle("dark", savedTheme === "dark")
        }
    }, [])

    const handleThemeChange = (newTheme: "light" | "dark") => {
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
        document.documentElement.classList.toggle("dark", newTheme === "dark")
    }

    return (
        <div className="min-h-screen">
            {/* Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col border-r border-border bg-background">
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center gap-2.5 mb-12">
                        <TrendingUp className="h-6 w-6 text-[rgb(var(--accent))]" strokeWidth={2.5} />
                        <span className="text-[17px] font-semibold tracking-tight text-foreground">Future</span>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-subhead font-medium transition-colors ${
                                    item.active
                                        ? "bg-[rgb(var(--accent))] text-white"
                                        : "text-[rgb(var(--foreground-secondary))] hover:bg-white/5 hover:text-foreground"
                                }`}
                            >
                                <item.icon className="h-[18px] w-[18px]" strokeWidth={2} />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="border-t border-border pt-6">
                        <div className="flex items-center gap-3 px-3">
                            <div className="h-8 w-8 rounded-full bg-[rgb(var(--accent))]/10 flex items-center justify-center flex-shrink-0 ring-1 ring-[rgb(var(--accent))]/20">
                                <span className="text-caption font-semibold text-[rgb(var(--accent))]">JD</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-subhead font-medium text-foreground">John Doe</p>
                                <p className="text-caption text-[rgb(var(--foreground-tertiary))]">john@example.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="lg:ml-60 lg:pl-16 px-6 lg:pr-16 py-12 pb-32 lg:pb-16">
                <div className="max-w-[900px]">
                    <h1 className="text-display mb-12 text-foreground">Settings</h1>

                    <div className="space-y-6">
                        {/* Appearance */}
                        <div className="glass-card rounded-2xl overflow-hidden">
                            <div className="p-8 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center ring-1 ring-[rgb(var(--accent))]/20">
                                        {theme === "dark" ? (
                                            <Moon className="w-6 h-6 text-[rgb(var(--accent))]" strokeWidth={2} />
                                        ) : (
                                            <Sun className="w-6 h-6 text-[rgb(var(--accent))]" strokeWidth={2} />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-title-3 text-foreground mb-1">Appearance</h2>
                                        <p className="text-footnote text-[rgb(var(--foreground-tertiary))]">
                                            Customize how Future looks on your device
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-subhead font-medium text-foreground mb-1">Theme</p>
                                        <p className="text-footnote text-[rgb(var(--foreground-tertiary))]">Select your preferred theme</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleThemeChange("light")}
                                            className={`px-5 py-2.5 rounded-xl text-subhead font-medium transition-all flex items-center gap-2.5 ${
                                                theme === "light"
                                                    ? "bg-[rgb(var(--accent))] text-white shadow-lg shadow-[rgb(var(--accent))]/20"
                                                    : "bg-white/5 text-[rgb(var(--foreground-secondary))] hover:bg-white/10 border border-white/10"
                                            }`}
                                        >
                                            <Sun className="w-4 h-4" strokeWidth={2.5} />
                                            Light
                                        </button>
                                        <button
                                            onClick={() => handleThemeChange("dark")}
                                            className={`px-5 py-2.5 rounded-xl text-subhead font-medium transition-all flex items-center gap-2.5 ${
                                                theme === "dark"
                                                    ? "bg-[rgb(var(--accent))] text-white shadow-lg shadow-[rgb(var(--accent))]/20"
                                                    : "bg-white/5 text-[rgb(var(--foreground-secondary))] hover:bg-white/10 border border-white/10"
                                            }`}
                                        >
                                            <Moon className="w-4 h-4" strokeWidth={2.5} />
                                            Dark
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile */}
                        <div className="glass-card rounded-2xl overflow-hidden">
                            <div className="p-8 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center ring-1 ring-[rgb(var(--accent))]/20">
                                        <User className="w-6 h-6 text-[rgb(var(--accent))]" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h2 className="text-title-3 text-foreground mb-1">Profile</h2>
                                        <p className="text-footnote text-[rgb(var(--foreground-tertiary))]">
                                            Manage your account information
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div>
                                    <label className="block text-footnote font-medium text-[rgb(var(--foreground-secondary))] mb-3">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="John Doe"
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-[rgb(var(--foreground-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/50 focus:border-[rgb(var(--accent))]/50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-footnote font-medium text-[rgb(var(--foreground-secondary))] mb-3">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue="john@example.com"
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-[rgb(var(--foreground-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/50 focus:border-[rgb(var(--accent))]/50 transition-all"
                                    />
                                </div>
                                <button className="px-6 py-3 bg-[rgb(var(--accent))] text-white rounded-xl text-subhead font-medium hover:bg-[rgb(var(--accent-hover))] transition-colors shadow-lg shadow-[rgb(var(--accent))]/20">
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="glass-card rounded-2xl overflow-hidden">
                            <div className="p-8 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center ring-1 ring-[rgb(var(--accent))]/20">
                                        <Bell className="w-6 h-6 text-[rgb(var(--accent))]" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h2 className="text-title-3 text-foreground mb-1">Notifications</h2>
                                        <p className="text-footnote text-[rgb(var(--foreground-tertiary))]">
                                            Manage your notification preferences
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-subhead font-medium text-foreground mb-1">Push Notifications</p>
                                        <p className="text-footnote text-[rgb(var(--foreground-tertiary))]">
                                            Receive notifications about your account activity
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setNotifications(!notifications)}
                                        className={`relative w-14 h-7 rounded-full transition-colors ${
                                            notifications ? "bg-[rgb(var(--accent))]" : "bg-white/10"
                                        }`}
                                    >
                    <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-lg ${
                            notifications ? "translate-x-7" : "translate-x-0"
                        }`}
                    />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="glass-card rounded-2xl overflow-hidden">
                            <div className="p-8 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center ring-1 ring-[rgb(var(--accent))]/20">
                                        <Shield className="w-6 h-6 text-[rgb(var(--accent))]" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h2 className="text-title-3 text-foreground mb-1">Security</h2>
                                        <p className="text-footnote text-[rgb(var(--foreground-tertiary))]">
                                            Manage your security settings
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                    <div>
                                        <p className="text-subhead font-medium text-foreground mb-1">Two-Factor Authentication</p>
                                        <p className="text-footnote text-[rgb(var(--foreground-tertiary))]">
                                            Add an extra layer of security to your account
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setTwoFactor(!twoFactor)}
                                        className={`relative w-14 h-7 rounded-full transition-colors ${
                                            twoFactor ? "bg-[rgb(var(--accent))]" : "bg-white/10"
                                        }`}
                                    >
                    <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-lg ${
                            twoFactor ? "translate-x-7" : "translate-x-0"
                        }`}
                    />
                                    </button>
                                </div>
                                <button className="w-full px-6 py-3.5 bg-white/5 border border-white/10 text-foreground rounded-xl text-subhead font-medium hover:bg-white/10 hover:border-white/20 transition-all">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Nav */}
            <nav className="lg:hidden fixed bottom-0 inset-x-0 backdrop-blur-xl bg-background/90 border-t border-border">
                <div className="flex items-center justify-around py-2">
                    {navigation.slice(0, 4).map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 py-2.5 px-4 transition-colors ${
                                item.active ? "text-[rgb(var(--accent))]" : "text-[rgb(var(--foreground-tertiary))]"
                            }`}
                        >
                            <item.icon className="w-[22px] h-[22px]" strokeWidth={2} />
                            <span className="text-caption font-medium">{item.name}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    )
}
