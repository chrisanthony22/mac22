import { useRef, useState } from "react";
import "./RichTextEditor.css";
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaEraser, FaCode } from "react-icons/fa";

const RichTextEditor = ({ onChange }) => {
  const editorRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInput = () => {
    if (onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const insertCodeBlock = (language) => {
    const backgroundColors = {
      javascript: "#2d2d2d",
      php: "#4f2f4f",
      sql: "#2f4f4f",
      mysql: "#2a4d69",
      java: "#1b1b1b",
      python: "#4b8bbe",
      cpp: "#00599c",
      csharp: "#178600",
      html: "#e44d26",
      css: "#264de4",
      swift: "#ffac45",
      kotlin: "#7f52ff",
      dart: "#0175c2",
    };

    const uniqueId = `code-block-${Date.now()}`;

    const codeTemplate = `
      <div id="${uniqueId}" class="code-block" data-lang="${language}" 
           style="position: relative; background-color: ${backgroundColors[language] || "#333"};
                  color: white; padding: 10px; border-radius: 5px;
                  margin: 10px 0; padding-top: 30px;">
        
        <span class="code-close" contentEditable="false"
              onclick="document.getElementById('${uniqueId}').remove();"
              style="position: relative; top: 5px; right: 10px; z-index:-1;
                     cursor: pointer; user-select: none; pointer-events: auto;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>

        <pre><code class="language-${language}" contentEditable="true" 
          oninput="this.innerText = this.innerText.replace(/\\n/g, '\\n');">// Write your ${language} code here</code></pre>
      </div><br/>
    `;

    document.execCommand("insertHTML", false, codeTemplate);
    handleInput();
    editorRef.current.focus();
    setShowDropdown(false); // Hide dropdown after selection
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="toolbar">
        <button onClick={() => formatText("bold")}><FaBold /></button>
        <button onClick={() => formatText("italic")}><FaItalic /></button>
        <button onClick={() => formatText("underline")}><FaUnderline /></button>
        <button onClick={() => formatText("insertUnorderedList")}><FaListUl /></button>
        <button onClick={() => formatText("insertOrderedList")}><FaListOl /></button>
        <button onClick={() => formatText("removeFormat")}><FaEraser /></button>

        {/* Code Block Dropdown */}
        <div className="dropdown">
          <button onClick={() => setShowDropdown(!showDropdown)}>
            <FaCode /> Insert Code
          </button>

          {showDropdown && (
            <div className="dropdown-menu">
              {["javascript", "php", "sql", "mysql", "java", "python", "cpp", "csharp", "html", "css", "swift", "kotlin", "dart"].map((lang) => (
                <button key={lang} onClick={() => insertCodeBlock(lang)}>
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        style={{
          border: "1px solid #ccc",
          borderRadius: "0px 0px 5px 5px",
          minHeight: "270px",
          padding: "10px",
          outline: "none",
          color: "white",
          backgroundColor: "#222",
          whiteSpace: "pre-wrap", // Ensures newlines are respected
          overflowWrap: "break-word"
        }}
      />
    </div>
  );
};

export default RichTextEditor;
