import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../redux/Slice/userSlice";
import { motion, AnimatePresence } from "framer-motion";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [snackbar, setSnackbar] = useState({ show: false, message: "", type: "success" });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showSnackbar = (message, type = "success") => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => setSnackbar({ ...snackbar, show: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const result = await dispatch(
        loginUser({ email: formData.email, password: formData.password })
      );
      if (result.meta.requestStatus === "fulfilled") {
        showSnackbar("Login successful 🎉", "success");
        navigate("/dashboard");
      } else {
        showSnackbar(result.payload || "Login failed", "error");
      }
    } else {
      const result = await dispatch(registerUser(formData));
      if (result.meta.requestStatus === "fulfilled") {
        showSnackbar("Signup successful 🎉", "success");
        navigate("/dashboard");
      } else {
        showSnackbar(result.payload || "Signup failed", "error");
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-gray-900 to-black animate-gradient-x opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-purple-900 to-black animate-gradient-y opacity-30"></div>
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* Floating Particles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-500/60"
          initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: 0 }}
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            opacity: [0, 1, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 8 + Math.random() * 6,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Auth Card */}
      <div className="w-full max-w-md relative z-10 bg-gray-900/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-white border border-purple-600/20">
        <a href="/" className="mb-6 text-3xl font-bold flex items-center justify-center space-x-1 hover:text-purple-300 transition-colors">
          <span className="text-purple-400">&lt;</span>
          <span className="text-white">Ayush</span>
          <span className="text-purple-400">/&gt;</span>
        </a>

        <h2 className="text-3xl font-bold mb-6 text-center">{isLogin ? "Admin Login" : "Sign Up"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block mb-1 text-gray-300">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="w-full p-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          )}

          <div>
            <label className="block mb-1 text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full p-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full p-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-purple-400 transition-all duration-300"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button className="text-purple-400 font-semibold hover:underline" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>

      {/* Snackbar */}
      <AnimatePresence>
        {snackbar.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-semibold shadow-lg text-white ${
              snackbar.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {snackbar.message}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes gradientX {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes gradientY {0%{background-position:50% 0%}50%{background-position:50% 100%}100%{background-position:50% 0%}}
        .animate-gradient-x {background-size:200% 200%; animation: gradientX 25s ease infinite;}
        .animate-gradient-y {background-size:200% 200%; animation: gradientY 35s ease infinite;}
      `}</style>
    </div>
  );
}
