import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProveedorServicios } from "@/state/contextoServicios";
import { NOMBRE_BARBERIA, ESLOGAN_BARBERIA } from "@/constants/barberia";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: NOMBRE_BARBERIA, template: `%s | ${NOMBRE_BARBERIA}` },
  description: ESLOGAN_BARBERIA,
};

const darkModeScript = `
(function(){
  try{
    var t=localStorage.getItem("tema");
    if(t==="oscuro"||(t===null&&window.matchMedia("(prefers-color-scheme: dark)").matches)){
      document.documentElement.classList.add("dark");
    }
  }catch(e){}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ProveedorServicios>{children}</ProveedorServicios>
      </body>
    </html>
  );
}
