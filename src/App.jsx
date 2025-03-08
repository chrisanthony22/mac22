import './App.css';
import { useState, useEffect } from "react";
import Home from './sections/Home/Home';
import Note from './sections/Note/Note';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify';
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const storedUserSession = JSON.parse(localStorage.getItem("userSession"));
    console.log("Stored Session:", storedUserSession); // 🔍 Debug log

    if (storedUserSession && storedUserSession.id) {
      setIsLoggedIn(true);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Firebase Auth State Changed:", user); // 🔍 Debug log

      if (user) {
        setIsLoggedIn(true);
        localStorage.setItem('userSession', JSON.stringify(user));
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem('userSession');
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoggedIn === null) return <p>Loading...</p>;

  const handleLogout = () => {
    auth.signOut().then(() => {
      setIsLoggedIn(false);
      localStorage.removeItem("userSession");
    });
  };

  return (
    <Router>
      <div>
        <ToastContainer /> 
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/note" replace /> : <Home setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/note" element={isLoggedIn ? <Note handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
