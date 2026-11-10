import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { NetworkStatus } from "@/components/system/NetworkStatus";
import { ChatLauncher } from "@/features/chat/ChatLauncher";
import { CurrencyProvider } from "@/features/pricing/CurrencyProvider";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/seo";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Digital & Technology Studio`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: site.name, locale: "en", url: "/" },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/assets/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/assets/brand/favicon-180.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#07101e",
  width: "device-width",
  initialScale: 1,
};

/** Runs before paint: enables motion classes and the session-once intro. */
const bootScript = `(function(){try{var d=document.documentElement;if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js-motion')}if(sessionStorage.getItem('ctl-intro')){d.classList.add('intro-seen')}else{sessionStorage.setItem('ctl-intro','1')}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <div className="ctl-loader" aria-hidden="true">
          <div className="flex flex-col items-center">
            <Image className="ctl-loader__mark h-auto w-[88px]" src={site.logo.mark} alt="" width={364} height={273} priority />
            <span className="ctl-loader__line" />
          </div>
        </div>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white">
          Skip to content
        </a>
        <CurrencyProvider>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
          <NetworkStatus />
          <ChatLauncher />
        </CurrencyProvider>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
