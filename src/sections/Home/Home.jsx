import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // 🔥 Import useNavigate
import Hero from "../Hero/Hero";
import ThreeD from "../3d/ThreeD";
import Login from "../Login/login";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function Home({ setIsLoggedIn }) {
  const [showLogin, setShowLogin] = useState(false);
  const [randomCode, setRandomCode] = useState("");
  const codeRef = useRef(null);
  const navigate = useNavigate(); // 🔥 Initialize navigation

  // Hardcoded code samples
  const codeSamples = [
    `import React from 'react';\nfunction HelloWorld() {\n  return <h1>Hello, World!</h1>;\n}\nexport default HelloWorld;`,
    `const add = (a, b) => a + b;\nconsole.log(add(2, 3)); // 5`,
    `class Person {\n  constructor(name) {\n    this.name = name;\n  }\n  greet() {\n    return \`Hello, \${this.name}!\`;\n  }\n}\nconst p = new Person("Alice");\nconsole.log(p.greet());`,
  ];

  const fetchRandomCode = () => {
    const randomSnippet = codeSamples[Math.floor(Math.random() * codeSamples.length)];
    setRandomCode(randomSnippet);
    setTimeout(startAnimation, 500);
  };

  useEffect(() => {
    fetchRandomCode(); // Load first snippet
  }, []);

  const startAnimation = () => {
    if (!codeRef.current) return;
    const element = codeRef.current;
    element.style.top = "100%"; // Start from bottom

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
        setTimeout(fetchRandomCode, 1000); // Wait 1 second before loading new snippet
      }
    };

    requestAnimationFrame(animate);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate("/note", { replace: true }); // 🔥 Redirect to Notes Page
  };

  return (
    <div className="app-container">
      <div className="left-column">
        <Hero />
      </div>

      <div className="right-column">
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
                  <Login closePopup={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />
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
