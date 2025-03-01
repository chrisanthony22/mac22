import './App.css'
import { useState, useEffect } from "react";
import Home from './sections/Home/Home';
import Note from './sections/Note/Note';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify';
import { useAuthRedirect } from "./utils/auth";

const AuthWrapper = ({ isLoggedIn }) => {
  useAuthRedirect(isLoggedIn);
  return null; // This component doesn't render anything, it just runs the hook.
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userSession')); // Check session on load

  const handleLogout = () => {
    localStorage.removeItem('userSession'); // Clear session
    setIsLoggedIn(false); // Update state
  };

  return (
    <Router>
      <AuthWrapper isLoggedIn={isLoggedIn} />
      <div>
        <ToastContainer /> 
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/note" /> : <Home setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/note" element={isLoggedIn ? <Note handleLogout={handleLogout} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}



export default App
