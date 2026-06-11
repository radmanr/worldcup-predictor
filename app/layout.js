import "./globals.css";
import { Vazirmatn } from "next/font/google";
import Nav from "./components/Nav";
import { getCurrentUser } from "@/lib/auth";

const vazir = Vazirmatn({ subsets: ["arabic"], weight: ["400", "600", "700", "800"] });

export const metadata = {
  title: "پیش‌بینی جام جهانی ۲۰۲۶ — فیروزه",
  description: "بازی پیش‌بینی جام جهانی ۲۰۲۶ برای همکاران شرکت فیروزه.",
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();
  return (
    <html lang="fa" dir="rtl" className={vazir.className}>
      <body>
        <Nav user={user} />
        <main className="container">{children}</main>
        <footer className="site-footer">
          ساخته‌شده برای همکاران <span className="brand-text">فیروزه</span> · جام جهانی ۲۰۲۶
        </footer>
      </body>
    </html>
  );
}
