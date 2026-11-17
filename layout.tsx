import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono, Caveat_Brush } from "next/font/google";
import "./globals.css";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const caveat = Caveat_Brush({ subsets: ["latin"], weight: "400", variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "Dipangshu Golui — Creative Technologist",
  description: "The portfolio of Dipangshu Golui, Founder of Velroyn Web Studios.",
};

const bootScript = `try { const p = new URLSearchParams(location.search); const forced = p.get('agents'); const saved = localStorage.getItem('velroyn-agents'); const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; if (forced === 'off' || (forced !== 'on' && (saved === 'off' || (!saved && reduced)))) document.documentElement.classList.add('no-build'); else document.documentElement.classList.add('build-mode'); } catch { document.documentElement.classList.add('no-build'); }`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: bootScript }} /></head><body className={`${anton.variable} ${geist.variable} ${geistMono.variable} ${caveat.variable}`}>{children}</body></html>;
}
