import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: 'rgb(var(--background) / <alpha-value>)',
                surface: 'rgb(var(--surface) / <alpha-value>)',
                foreground: {
                    DEFAULT: 'rgb(var(--foreground) / <alpha-value>)',
                    secondary: 'rgb(var(--foreground-secondary) / <alpha-value>)',
                    tertiary: 'rgb(var(--foreground-tertiary) / <alpha-value>)',
                },
                accent: {
                    DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
                    hover: 'rgb(var(--accent-hover) / <alpha-value>)',
                },
                positive: 'rgb(var(--positive) / <alpha-value>)',
                negative: 'rgb(var(--negative) / <alpha-value>)',
                border: 'rgb(var(--border) / <alpha-value>)',
            },
            borderRadius: {
                DEFAULT: 'var(--radius)',
            },
            fontFamily: {
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'SF Pro Display',
                    'SF Pro Text',
                    'Segoe UI',
                    'Roboto',
                    'sans-serif',
                ],
            },
        },
    },
    plugins: [],
}

export default config