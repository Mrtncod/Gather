import "./globals.css";
import Script from "next/script";
import { ShoppingProvider } from "@/features/shopping/shopping-context";

export const metadata = {
  title: "Gather — plan meals, shop with ease",
  description: "Plan recipes for the week and turn every meal into a clear, flexible shopping list.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="gather-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try { if (localStorage.getItem("gather-theme") === "dark") document.documentElement.classList.add("dark"); } catch {}`,
          }}
        />
      </head>
      <body>
        <ShoppingProvider>{children}</ShoppingProvider>
      </body>
    </html>
  );
}
