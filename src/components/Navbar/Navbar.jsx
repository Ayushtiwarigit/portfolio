import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = ["home", "about", "experience", "projects", "contact"];
    const handleScroll = () => {
      const scrollY = window.scrollY;
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop - 80;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollY >= offsetTop && scrollY < offsetBottom) {
            setActive(section);
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = ["about", "experience", "projects", "contact"];

  return (
    <nav className="fixed w-full top-0 left-0 z-50 bg-gradient-to-r from-black via-purple-900 to-black text-white shadow-2xl transition-all duration-500">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <a
          href="/"
          className="text-2xl font-bold hover:text-purple-400 transition-colors flex items-center space-x-1"
        >
          <span className="text-purple-500">&lt;</span>
          <span className="text-white">Ayush</span>
          <span className="text-purple-500">/&gt;</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-8 text-lg relative">
            {menuItems.map((item) => (
              <li key={item} className="relative">
                <a
                  href={`#${item}`}
                  className="transition-colors duration-300 font-medium"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
                {/* Animated underline */}
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 bottom-0 h-1 bg-purple-400 rounded-full"
                  style={{ width: active === item ? "100%" : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </li>
            ))}
          </ul>

          {/* User/Login Icon */}
          <a
            href="/login"
            className="text-2xl hover:text-purple-400 transition-colors ml-6"
            title="Login"
          >
            <FaUserCircle />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <a
            href="/login"
            className="text-2xl hover:text-purple-400 transition-colors"
            title="Login"
          >
            <FaUserCircle />
          </a>
          <button
            className="text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <span className="text-3xl">&times;</span>
            ) : (
              <span className="text-3xl">&#9776;</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="md:hidden bg-gradient-to-b from-purple-900 via-purple-800 to-purple-700 overflow-hidden"
      >
        <ul className="px-6 py-4 space-y-4 text-lg">
          {menuItems.map((item) => (
            <li key={item}>
              <a
                href={`#${item}`}
                className={`block transition-all duration-300 ${
                  active === item ? "text-purple-300 font-semibold" : "hover:text-purple-200"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </nav>
  );
}
