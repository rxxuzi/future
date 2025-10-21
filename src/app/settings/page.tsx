"use client"

import {
    Settings,
    User,
    Bell,
    Shield,
    CreditCard,
    Database,
    Globe,
    Moon,
    Sun,
    Key,
    Mail,
    Smartphone,
    AlertTriangle
} from "lucide-react"
import { useState } from "react"
import { Layout } from "@/components/layout/Layout"

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<string>("profile")
    const [theme, setTheme] = useState<"light" | "dark">("dark")
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(true)
    const [marketAlerts, setMarketAlerts] = useState(false)
    const [twoFactor, setTwoFactor] = useState(false)
    const [apiAccess, setApiAccess] = useState(false)

    const sections = [
        { id: "profile", name: "Profile", icon: User },
        { id: "appearance", name: "Appearance", icon: Moon },
        { id: "notifications", name: "Notifications", icon: Bell },
        { id: "security", name: "Security", icon: Shield },
        { id: "billing", name: "Billing", icon: CreditCard },
        { id: "data", name: "Data & Privacy", icon: Database },
        { id: "language", name: "Language & Region", icon: Globe },
    ]

    return (
        <Layout
            maxWidth="max-w-full"
            padding={{
                left: "lg:ml-60",
                right: "",
                top: "pt-0",
                bottom: "pb-32 lg:pb-0"
            }}
        >
            {/* Header */}
            <div className="border-b border-border">
                <div className="px-8 py-6">
                    <h1 className="text-[32px] font-bold tracking-tight text-foreground">
                        Settings
                    </h1>
                </div>
            </div>

            {/* Settings Navigation */}
            <div className="border-b border-border">
                <div className="px-8 py-0 flex gap-1 overflow-x-auto">
                    {sections.map((section) => {
                        const Icon = section.icon
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                    activeSection === section.id
                                        ? "text-foreground border-[rgb(var(--accent))]"
                                        : "text-[rgb(var(--foreground-secondary))] border-transparent hover:text-foreground"
                                }`}
                            >
                                <Icon className="w-4 h-4" strokeWidth={2} />
                                {section.name}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Settings Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Main Content Area */}
                <div className="lg:col-span-2 border-r border-border">
                    {/* Profile Section */}
                    {activeSection === "profile" && (
                        <>
                            {/* Personal Information */}
                            <div className="px-8 py-6 border-b border-border">
                                <div className="mb-6">
                                    <h2 className="text-sm font-semibold text-foreground mb-1">
                                        Personal Information
                                    </h2>
                                    <p className="text-xs text-[rgb(var(--foreground-tertiary))]">
                                        Update your account details
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-[rgb(var(--foreground-tertiary))] mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="John"
                                                className="w-full h-9 px-4 bg-[rgb(var(--surface))] border border-border text-sm text-foreground placeholder:text-[rgb(var(--foreground-tertiary))] focus:outline-none focus:border-[rgb(var(--accent))]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[rgb(var(--foreground-tertiary))] mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="Doe"
                                                className="w-full h-9 px-4 bg-[rgb(var(--surface))] border border-border text-sm text-foreground placeholder:text-[rgb(var(--foreground-tertiary))] focus:outline-none focus:border-[rgb(var(--accent))]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-[rgb(var(--foreground-tertiary))] mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            defaultValue="john@example.com"
                                            className="w-full h-9 px-4 bg-[rgb(var(--surface))] border border-border text-sm text-foreground placeholder:text-[rgb(var(--foreground-tertiary))] focus:outline-none focus:border-[rgb(var(--accent))]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-[rgb(var(--foreground-tertiary))] mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            defaultValue="+81 90 1234 5678"
                                            className="w-full h-9 px-4 bg-[rgb(var(--surface))] border border-border text-sm text-foreground placeholder:text-[rgb(var(--foreground-tertiary))] focus:outline-none focus:border-[rgb(var(--accent))]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="px-8 py-4 border-b border-border">
                                <button className="px-4 h-9 bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))] text-white text-sm font-medium">
                                    Save Changes
                                </button>
                            </div>
                        </>
                    )}

                    {/* Appearance Section */}
                    {activeSection === "appearance" && (
                        <>
                            {/* Theme Selection */}
                            <div className="px-8 py-6 border-b border-border">
                                <div className="mb-6">
                                    <h2 className="text-sm font-semibold text-foreground mb-1">
                                        Theme
                                    </h2>
                                    <p className="text-xs text-[rgb(var(--foreground-tertiary))]">
                                        Select your preferred color scheme
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setTheme("light")}
                                        className={`h-24 border-2 flex flex-col items-center justify-center gap-2 transition-colors ${
                                            theme === "light"
                                                ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))]/10"
                                                : "border-border hover:border-[rgb(var(--foreground-tertiary))]"
                                        }`}
                                    >
                                        <Sun className="w-6 h-6" strokeWidth={2} />
                                        <span className="text-sm font-medium">Light</span>
                                    </button>
                                    <button
                                        onClick={() => setTheme("dark")}
                                        className={`h-24 border-2 flex flex-col items-center justify-center gap-2 transition-colors ${
                                            theme === "dark"
                                                ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))]/10"
                                                : "border-border hover:border-[rgb(var(--foreground-tertiary))]"
                                        }`}
                                    >
                                        <Moon className="w-6 h-6" strokeWidth={2} />
                                        <span className="text-sm font-medium">Dark</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Notifications Section */}
                    {activeSection === "notifications" && (
                        <>
                            {/* Email Notifications */}
                            <div className="px-8 py-6 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Mail className="w-4 h-4 text-[rgb(var(--foreground-tertiary))]" strokeWidth={2} />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                Email Notifications
                                            </p>
                                            <p className="text-xs text-[rgb(var(--foreground-tertiary))]">
                                                Receive updates via email
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setEmailNotifications(!emailNotifications)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${
                                            emailNotifications ? "bg-[rgb(var(--accent))]" : "bg-[rgb(var(--foreground-tertiary))]"
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                                emailNotifications ? "translate-x-6" : "translate-x-0"
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Push Notifications */}
                            <div className="px-8 py-6 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Smartphone className="w-4 h-4 text-[rgb(var(--foreground-tertiary))]" strokeWidth={2} />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                Push Notifications
                                            </p>
                                            <p className="text-xs text-[rgb(var(--foreground-tertiary))]">
                                                Receive mobile push notifications
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setPushNotifications(!pushNotifications)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${
                                            pushNotifications ? "bg-[rgb(var(--accent))]" : "bg-[rgb(var(--foreground-tertiary))]"
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                                pushNotifications ? "translate-x-6" : "translate-x-0"
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Market Alerts */}
                            <div className="px-8 py-6 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <AlertTriangle className="w-4 h-4 text-[rgb(var(--foreground-tertiary))]" strokeWidth={2} />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                Market Alerts
                                            </p>
                                            <p className="text-xs text-[rgb(var(--foreground-tertiary))]">
                                                Get notified about significant market movements
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setMarketAlerts(!marketAlerts)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${
                                            marketAlerts ? "bg-[rgb(var(--accent))]" : "bg-[rgb(var(--foreground-tertiary))]"
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                                marketAlerts ? "translate-x-6" : "translate-x-0"
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Security Section */}
                    {activeSection === "security" && (
                        <>
                            {/* Two-Factor Authentication */}
                            <div className="px-8 py-6 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Shield className="w-4 h-4 text-[rgb(var(--foreground-tertiary))]" strokeWidth={2} />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                Two-Factor Authentication
                                            </p>
                                            <p className="text-xs text-[rgb(var(--foreground-tertiary))]">
                                                Add an extra layer of security to your account
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setTwoFactor(!twoFactor)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${
                                            twoFactor ? "bg-[rgb(var(--accent))]" : "bg-[rgb(var(--foreground-tertiary))]"
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                                twoFactor ? "translate-x-6" : "translate-x-0"
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Change Password */}
                            <div className="px-8 py-6 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Key className="w-4 h-4 text-[rgb(var(--foreground-tertiary))]" strokeWidth={2} />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                Password
                                            </p>
                                            <p className="text-xs text-[rgb(var(--foreground-tertiary))]">
                                                Last changed 30 days ago
                                            </p>
                                        </div>
                                    </div>
                                    <button className="px-4 h-8 border border-border hover:bg-[rgb(var(--surface))] text-sm font-medium">
                                        Change Password
                                    </button>
                                </div>
                            </div>

                            {/* API Access */}
                            <div className="px-8 py-6 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Database className="w-4 h-4 text-[rgb(var(--foreground-tertiary))]" strokeWidth={2} />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                API Access
                                            </p>
                                            <p className="text-xs text-[rgb(var(--foreground-tertiary))]">
                                                Enable programmatic access to your data
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setApiAccess(!apiAccess)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${
                                            apiAccess ? "bg-[rgb(var(--accent))]" : "bg-[rgb(var(--foreground-tertiary))]"
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                                apiAccess ? "translate-x-6" : "translate-x-0"
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Other sections can be similarly implemented */}
                </div>

                {/* Side Panel - Activity/Status */}
                <div className="lg:col-span-1">
                    {/* Account Status */}
                    <div className="px-8 py-6 border-b border-border">
                        <h3 className="text-xs font-semibold text-[rgb(var(--foreground-tertiary))] mb-4">
                            Account Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[rgb(var(--foreground-secondary))]">Plan</span>
                                <span className="text-sm font-medium text-foreground">Free</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[rgb(var(--foreground-secondary))]">Member Since</span>
                                <span className="text-sm font-medium text-foreground font-mono">2024-01-15</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[rgb(var(--foreground-secondary))]">Storage Used</span>
                                <span className="text-sm font-medium text-foreground">2.3 GB / 10 GB</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="px-8 py-6 border-b border-border">
                        <h3 className="text-xs font-semibold text-[rgb(var(--foreground-tertiary))] mb-4">
                            Recent Activity
                        </h3>
                        <div className="space-y-3">
                            <div className="text-sm">
                                <p className="text-[rgb(var(--foreground-secondary))]">Password changed</p>
                                <p className="text-xs text-[rgb(var(--foreground-tertiary))] font-mono">30 days ago</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-[rgb(var(--foreground-secondary))]">Email verified</p>
                                <p className="text-xs text-[rgb(var(--foreground-tertiary))] font-mono">45 days ago</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-[rgb(var(--foreground-secondary))]">Account created</p>
                                <p className="text-xs text-[rgb(var(--foreground-tertiary))] font-mono">2024-01-15</p>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="px-8 py-6">
                        <h3 className="text-xs font-semibold text-red-400 mb-4">
                            Danger Zone
                        </h3>
                        <button className="w-full px-4 h-9 border border-red-400 text-red-400 hover:bg-red-400/10 text-sm font-medium">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

        </Layout>
    )
}