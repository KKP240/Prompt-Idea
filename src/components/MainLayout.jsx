import { Outlet } from "react-router";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div className="bg-gray-50 flex flex-col">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-275 w-full mx-auto min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
