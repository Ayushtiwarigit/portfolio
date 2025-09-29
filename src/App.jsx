import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";

import Login from "./components/auth/Login";
import About from "./components/About/About";
import AdminDashboard from "./components/Adminarea/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Login/Signup */}
        <Route path="/login" element={<Login />} />
        <Route path ="/about" element={<About/>}/>
        <Route path ="/dashboard/*" element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
