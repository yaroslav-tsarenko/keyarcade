import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { CurrencyProvider } from "@/components/ui/CurrencyProvider";
import { CartProvider } from "@/components/ui/CartProvider";
import { WishlistProvider } from "@/components/ui/WishlistProvider";
import { ThemeProvider, THEME_KEY } from "@/components/ui/ThemeProvider";
import { CookieConsent } from "@/components/sections/CookieConsent";
import { SITE } from "@/lib/site-config";

/** Display — rounded-yet-precise geometric, console-native. */
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

/** UI and body copy. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — game keys & digital codes`,
    template: `%s — ${SITE.name}`,
  },
  description:
    "Buy digital game keys for Steam, Epic, Xbox, PlayStation, Nintendo and GOG — original codes delivered to your inbox in a minute.",
  icons: { icon: "/icon.svg" },
};

/** Light is the primary theme; the browser chrome matches the ice deck. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f5fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1420" },
  ],
  width: "device-width",
  initialScale: 1,
};

/* Resolve the theme before first paint so the deck never flashes. Light wins
   unless the visitor chose dark, or their system asks for it and they have not
   chosen anything. */
const themeScript = `(()=>{try{var s=localStorage.getItem('${THEME_KEY}');var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;var e=document.documentElement;e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light';}catch(_){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col overflow-x-hidden bg-deck text-ink antialiased">
        <a
          href="#main"
          className="sr-only rounded-control bg-signal px-4 py-2 font-semibold text-on-signal focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <CurrencyProvider>
            <CartProvider>
              <WishlistProvider>
                <Header />
                <main id="main" className="flex-1">
                  {children}
                </main>
                <Footer />
                <CookieConsent />
              </WishlistProvider>
            </CartProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
