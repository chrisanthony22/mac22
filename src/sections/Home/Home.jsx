import React, { useState, useEffect, useRef } from "react";
import Hero from "../Hero/Hero";
import ThreeD from "../3d/ThreeD";
import Login from "../Login/login";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function Home({ setIsLoggedIn }) {
  const [showLogin, setShowLogin] = useState(false);
  const [randomCode, setRandomCode] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const codeRef = useRef(null);

  // Fetch a random file
  const fetchRandomFile = () => {
    fetch("files.json")
      .then((res) => res.json())
      .then((data) => {
        const files = data.files;
        const randomFile = files[Math.floor(Math.random() * files.length)];
        return fetch(`/${randomFile}`);
      })
      .then((res) => res.text())
      .then((data) => {
        setRandomCode(data);
        setTimeout(startAnimation, 500); // Delay before starting animation
      });
  };

  useEffect(() => {
    fetchRandomFile(); // Load the first file
  }, []);

  // Scroll Animation
  const startAnimation = () => {
    if (!codeRef.current) return;

    const element = codeRef.current;
    element.style.top = "100%"; // Start from bottom
    setIsAnimating(true);

    let startTime = null;
    const duration = 20000; // 20 seconds for full scroll
const animate = (timestamp) => {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;
  const progress = Math.min(elapsed / duration, 1);

  // Moves from 100% to -100% (fully scrolls off-screen)
  element.style.top = `${100 - progress * 200}%`;  

  if (progress < 1) {
    requestAnimationFrame(animate);
  } else {
    setIsAnimating(false);
    
    // Wait a moment before loading the new file
    setTimeout(() => {
      fetchRandomFile();
    }, 500); 
  }
};

requestAnimationFrame(animate);
  };

  return (
    <div className="app-container">
      <div className="left-column">
        <Hero />
        <button onClick={() => alert("Mac alert")}>Show Alert</button>
      </div>

      <div className="right-column">
        {/* Scrolling Code Background */}
        <div className="code-wrapper">
          <div ref={codeRef} className="scrolling-code">
          <SyntaxHighlighter
            language="jsx"
            style={atomDark}
            wrapLongLines={true} // ✅ Prevents horizontal scrolling
            showLineNumbers
            customStyle={{
              fontSize: "10px",
              background: "transparent", // ✅ Removes background color
              padding: "0", // ✅ Removes internal padding
              overflow: "hidden", // ✅ Ensures no scrollbars
            }}
          >
              {randomCode}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className="three-d-container">
          <ThreeD />
          <div className="text-overlay">
            <h2>m@c22</h2>
            <button onClick={() => setShowLogin(true)}>Login</button>
            {showLogin && (
              <div className="popup">
                <div className="popup-content">
                  <span className="close" onClick={() => setShowLogin(false)}>
                    &times;
                  </span>
                  <Login
                    closePopup={() => setShowLogin(false)}
                    onLoginSuccess={() => setIsLoggedIn(true)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
