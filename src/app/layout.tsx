import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "./theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KNOCK-KNU | 경북대학교 캠퍼스 소셜 플랫폼",
  description: "경북대학교 학생들을 위한 캠퍼스 소셜 & 유틸리티 플랫폼. 아이스브레이킹, 메뉴 고르기, MBTI 궁합, 오늘의 운세까지!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div id="app-container">
          <ThemeProvider>
            <Providers>{children}</Providers>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
