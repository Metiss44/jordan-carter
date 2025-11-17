import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ["latin"],
  variable: '--font-cormorant',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600'],
  subsets: ["latin"],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "THE BODY HEALER - Jordan Carter | Soins Énergétiques",
  description: "Reconnecte-toi à ton corps, apaise ton esprit. Je t'aide à écouter les messages de ton corps pour libérer les tensions et retrouver un ancrage profond.",
  keywords: ["soins énergétiques", "respiration consciente", "bien-être", "Jordan Carter", "The Body Healer"],
  openGraph: {
    title: "THE BODY HEALER - Jordan Carter",
    description: "Reconnecte-toi à ton corps, apaise ton esprit.",
    type: "website",
  },
  icons: [
    { rel: 'icon', url: 'https://cdn.the-body-healer.com/favicon-thebodyhealer.webp' },
    { rel: 'apple-touch-icon', url: 'https://cdn.the-body-healer.com/favicon-thebodyhealer.webp' }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${poppins.variable} scroll-smooth`}>
      <body className={`${poppins.className} antialiased bg-brand-blue text-brand-beige min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
