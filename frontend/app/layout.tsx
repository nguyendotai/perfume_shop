"use client"
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { store } from "@/lib/store";
import { Provider } from "react-redux";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body>
          <header className="w-full h-[90px]">
              <Header></Header>
          </header>
            <main className="min-h-[300]">{children}</main>
          <Footer></Footer>
        </body>
      </html>
    </Provider>
  );
}
