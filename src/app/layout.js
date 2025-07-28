import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "🎓 YTGuide",
    template: "%s | YTGuide"
  },
  description: "AI-powered platform that helps self-learners evaluate and choose the best YouTube courses. Compare multiple YouTube videos/playlists and get AI-backed recommendations based on content quality, relevance, and learning value.",
  
  keywords: [
    "YouTube course selection",
    "AI course comparison", 
    "self-learning",
    "online education",
    "YouTube tutorial ranking",
    "course evaluation",
    "learning recommendations"
  ],
  
  authors: [{ name: "Kashyap-kp" }],
  creator: "YTGuide",
  
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yt-guide-one.vercel.app",
    siteName: "YTGuide",
    title: "🎓 YTGuide - Smart YouTube Course Selection",
    description: "AI-powered platform helping self-learners make smarter YouTube choices. Compare courses and get personalized recommendations.",
    images: [
      {
        url: "https://yt-guide-one.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "YTGuide - Smart YouTube Course Selection",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "🎓 YTGuide - Smart YouTube Course Selection",
    description: "AI-powered platform helping self-learners make smarter YouTube choices",
    images: ["https://yt-guide-one.vercel.app/twitter-image.png"],
  },
  
  metadataBase: new URL("https://yt-guide-one.vercel.app"),
  
  robots: {
    index: true,
    follow: true,
  },
  
  category: "education",
  applicationName: "YTGuide",
  
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://yt-guide-one.vercel.app/#website",
                  "name": "YTGuide",
                  "alternateName": "YouTube Course Guide",
                  "url": "https://yt-guide-one.vercel.app/",
                  "description": "AI-powered platform that helps self-learners evaluate and choose the best YouTube courses",
                  "inLanguage": "en-US",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://yt-guide-one.vercel.app/search?q={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                  },
                  "publisher": {
                    "@id": "https://yt-guide-one.vercel.app/#organization"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://yt-guide-one.vercel.app/#organization",
                  "name": "YTGuide",
                  "url": "https://yt-guide-one.vercel.app/",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://yt-guide-one.vercel.app/logo.png",
                    "width": 512,
                    "height": 512
                  },
                  "sameAs": [
                    "https://github.com/kashyap-kp/ytguide"
                  ],
                  "founder": {
                    "@type": "Person",
                    "name": "Kashyap Prajapat"
                  }
                },
                {
                  "@type": "WebApplication",
                  "@id": "https://yt-guide-one.vercel.app/#webapp",
                  "name": "YTGuide",
                  "url": "https://yt-guide-one.vercel.app/",
                  "description": "AI-powered platform for comparing and selecting the best YouTube courses",
                  "applicationCategory": "EducationalApplication",
                  "operatingSystem": "Web Browser",
                  "browserRequirements": "Requires JavaScript. Requires HTML5.",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock"
                  },
                  "featureList": [
                    "AI-powered course analysis",
                    "YouTube video comparison",
                    "Learning recommendations",
                    "Course quality evaluation"
                  ],
                  "creator": {
                    "@type": "Person",
                    "name": "Kashyap Prajapat"
                  },
                  "datePublished": "2024",
                  "dateModified": "2025-07-28"
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}