import type { Metadata } from "next";
import "./globals.css";
import ToastContainer from "@/components/Toast";

export const metadata: Metadata = {
  title: "Eventos App",
  description: "Aplicación de eventos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}