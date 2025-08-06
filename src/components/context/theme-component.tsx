//@ts-nocheck
"use client"
import React, { useState } from 'react'
import { Theme } from '@radix-ui/themes'
import { createContext } from 'react'

export const Context = createContext();
export default function ThemeComponent({ children }) {
  const [isDark, setIsDark] = useState(false)
  return (
    <Context.Provider value={{ isDark, setIsDark }}>
      <Theme appearance='dark'>
        {children}
      </Theme>
    </Context.Provider>
  )
}
