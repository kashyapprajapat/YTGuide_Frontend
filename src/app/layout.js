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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
