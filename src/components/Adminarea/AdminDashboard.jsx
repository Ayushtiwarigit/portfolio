import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, resetUserState } from "../../redux/Slice/userSlice";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // <-- Added
import DashboardPage from "../../pages/DashboardPage";
import AboutPage from "../../pages/AboutPage";
import EducationPage from "../../pages/EducationPage";
import ExperiencesPage from "../../pages/ExperiencesPage";
import TechStackPage from "../../pages/TechStackPage";
import ProjectsPage from "../../pages/ProjectsPage";
import ContactPage from "../../pages/ContactPage";
import CertificationsPage from "../../pages/CertificationsPage";
import TestimonialsPage from "../../pages/TestimonialsPage";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // <-- Added
  const { user, token } = useSelector((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    if (token) dispatch(fetchCurrentUser());
    else navigate("/login"); // Redirect to login if no token
  }, [dispatch, token, navigate]);

  const handleLogout = () => {
    // 1. Clear Redux state
    dispatch(resetUserState());

    // 2. Remove token from localStorage
    localStorage.removeItem("token");

    // 3. Redirect to login page
    navigate("/login");
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard": return <DashboardPage />;
      case "about": return <AboutPage />;
      case "education": return <EducationPage />;
      case "experiences": return <ExperiencesPage />;
      case "techstack": return <TechStackPage />;
      case "projects": return <ProjectsPage />;
      case "contact": return <ContactPage />;
      case "certifications": return <CertificationsPage />;
      case "testimonials": return <TestimonialsPage />;
      default: return <DashboardPage />;
    }
  };

  const pages = [
    "dashboard",
    "about",
    "education",
    "experiences",
    "techstack",
    "projects",
    "contact",
    "certifications",
    "testimonials",
  ];

  return (
    <div className="flex h-screen relative text-white overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-gray-900 to-black animate-gradient-x opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-purple-900 to-black animate-gradient-y opacity-30"></div>
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-500/60"
          initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: 0 }}
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            opacity: [0, 1, 0],
          }}
          transition={{ repeat: Infinity, duration: 10 + Math.random() * 10, ease: "easeInOut" }}
        />
      ))}

      {/* Sidebar */}
      <aside className={`bg-gray-900 bg-opacity-80 backdrop-blur-md w-64 p-5 transition-all duration-300 ${sidebarOpen ? "block" : "hidden"} md:block z-10`}>
    <h1 className="text-2xl font-bold mb-6 flex items-center space-x-1">
  <span className="text-purple-500">&lt;</span>
  <span className="text-white">Ayush</span>
  <span className="text-purple-500">/&gt;</span>
</h1>

        <nav>
          <ul>
            {pages.map((page) => (
              <li
                key={page}
                className={`mb-4 p-2 rounded cursor-pointer transition ${activePage === page ? "bg-purple-800" : "hover:bg-purple-700"}`}
                onClick={() => setActivePage(page)}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col z-10 relative">
        {/* Header */}
        <header className="flex justify-between items-center bg-gray-900 bg-opacity-80 backdrop-blur-md shadow p-4">
          <div className="flex items-center space-x-3">
            <button className="md:hidden text-white text-2xl" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FiMenu />
            </button>
            <h2 className="text-xl font-bold text-purple-400">
              {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
            </h2>
          </div>

          {/* User Avatar */}
          <div className="relative group">
            <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center text-white cursor-pointer">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 bg-opacity-90 backdrop-blur-md shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 text-white z-10">
              <p className="font-semibold text-purple-300">{user?.username}</p>
              <p className="text-sm text-gray-300">{user?.email}</p>
              <button onClick={handleLogout} className="mt-2 text-red-600 hover:underline flex items-center gap-1">
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
