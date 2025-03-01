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

  // Fetch a random file from `public/files.json`
  const fetchRandomFile = async () => {
    try {
      const res = await fetch("/files.json"); // Fetch file list
      const data = await res.json();
      const files = data.files;

      if (!files.length) throw new Error("No files found");

      const randomFile = files[Math.floor(Math.random() * files.length)];
      const fileRes = await fetch(`/${randomFile}`); // Fetch file content

      if (!fileRes.ok) throw new Error(`Failed to load ${randomFile}`);

      const fileText = await fileRes.text();
      setRandomCode(fileText);
      setTimeout(startAnimation, 500);
    } catch (error) {
      console.error("Error loading file:", error);
      setRandomCode("// ⚠️ Error: Could not load file");
    }
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

      element.style.top = `${100 - progress * 200}%`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setTimeout(fetchRandomFile, 500);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="app-container">
      <div className="left-column">
        <Hero />
      </div>

      <div className="right-column">
        {/* Scrolling Code Background */}
        <div className="code-wrapper">
          <div ref={codeRef} className="scrolling-code">
            <SyntaxHighlighter
              language="jsx"
              style={atomDark}
              wrapLongLines={true}
              showLineNumbers
              customStyle={{
                fontSize: "10px",
                background: "transparent",
                padding: "0",
                overflow: "hidden",
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
