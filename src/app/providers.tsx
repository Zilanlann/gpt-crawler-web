'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey={undefined}>
            <NextUIProvider>
                {children}
            </NextUIProvider>
        </ThemeProvider>
    )
} 