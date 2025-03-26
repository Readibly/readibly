import type React from "react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import {ThemeProvider} from "next-themes"
import "./globals.css"


interface RootLayoutProps {
  children: React.ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return(
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Navbar></Navbar>
            <main className="flex-1">{children}</main>
            <Footer></Footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;