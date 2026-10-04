import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="p-5 bg-gradient-to-b from-blue-400 min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
