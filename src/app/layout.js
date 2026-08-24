import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Antbox",
  description: "AI recruiting agency",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital@0;1&family=Hanken+Grotesk:wght@400;600;800;900&family=Work+Sans:wght@400&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&display=swap" rel="stylesheet"/>
      </head>
      <body className="bg-cream text-dark-grey font-gothic overflow-x-hidden min-h-screen flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
