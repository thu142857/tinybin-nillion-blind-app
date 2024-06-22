import "@rainbow-me/rainbowkit/styles.css";
import { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import { ScaffoldEthAppWithProviders } from "@/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "@/components/ThemeProvider";
import "@/styles/globals.css";

const font = Press_Start_2P({ weight: ["400"], subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : `http://localhost:${process.env.PORT}`;
const imageUrl = `${baseUrl}/thumbnail.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "TinyBid-Nillion App",
    template: "%s | TinyBid-Nillion",
  },
  description: "Built with 🏗 TinyBid-Nillion",
  openGraph: {
    title: {
      default: "TinyBid-Nillion App",
      template: "%s | TinyBid-Nillion",
    },
    description: "Built with 🏗 TinyBid-Nillion",
    images: [
      {
        url: imageUrl,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [imageUrl],
    title: {
      default: "TinyBid-Nillion",
      template: "%s | TinyBid-Nillion",
    },
    description: "Built with 🏗 TinyBid-Nillion",
  },
  icons: {
    icon: [{ url: "/favicon.png", sizes: "32x32", type: "image/png" }],
  },
};

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body className={`${font.className} antialiased`}>
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
