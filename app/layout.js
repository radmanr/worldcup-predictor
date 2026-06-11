import "./globals.css";
import Nav from "./components/Nav";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Office World Cup Predictor 2026",
  description: "Predict the 2026 World Cup with your colleagues.",
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body>
        <Nav user={user} />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
