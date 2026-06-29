"use client";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ReactNode } from "react";

export default function ThemeComponent({ children }: { children: ReactNode }) {
  return <Theme appearance="light">{children}</Theme>;
}
