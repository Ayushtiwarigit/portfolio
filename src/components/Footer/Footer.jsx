import React, { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas to full width/height
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Generate random stars
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 150; i++) {
        newStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.2,
          opacity: Math.random() * 0.7 + 0.3,
          speed: Math.random() * 0.3 + 0.1,
          color: ["#8b5cf6", "#3b82f6", "#e5e7eb", "#f59e0b"][Math.floor(Math.random() * 4)],
        });
      }
      setStars(newStars);
    };
    generateStars();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity;
        ctx.fill();

        // Move stars
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // Draw mouse trail
      ctx.beginPath();
      ctx.arc(mousePosition.x, mousePosition.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#8b5cf6";
      ctx.globalAlpha = 0.5;
      ctx.fill();

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [mousePosition, stars]);

  return (
    <footer
      className="relative bg-black text-gray-300 py-20 px-6 overflow-hidden"
      onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
    >
      {/* Canvas for galaxy effect */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-90"
      />

      {/* Footer Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {/* About */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-purple-400">Ayush</h3>
          <p className="text-gray-400 text-sm">
            <strong>Full-stack developer</strong> building modern and scalable web applications.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-purple-400 mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {["about", "projects", "education", "contact"].map((link) => (
              <li key={link}>
                <a
                  href={`#${link}`}
                  className="transition text-gray-400 hover:text-purple-300 glow"
                >
                  {link.charAt(0).toUpperCase() + link.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-purple-400 mb-4">Contact</h4>
          <p className="flex items-center gap-2 text-gray-400">
            <FaEnvelope className="text-purple-400" /> ayush@example.com
          </p>
          <div className="flex gap-4 mt-2">
            {[FaGithub, FaLinkedin, FaTwitter].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 rounded-full transition text-gray-300 shadow hover:bg-purple-900 hover:text-white glow"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm relative z-10">
        &copy; {new Date().getFullYear()} Ayush. All rights reserved.
      </div>
    </footer>
  );
}
