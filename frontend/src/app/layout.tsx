import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { NOMBRE_BARBERIA, ESLOGAN_BARBERIA } from "@/constants/barberia";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "900"],
  style: ["normal", "italic"],
});

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
      <body className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
