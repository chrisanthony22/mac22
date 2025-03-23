import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../common/ThemeContext";
import "./Note.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleSaveNote } from "../Functions/system_functions";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { format } from "date-fns";
import { FaPlusCircle, FaSearch, FaTimes, FaSave, FaRegEdit } from "react-icons/fa";
import RichTextEditor from "../../components/RichTextEditor";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Menu from "../Menu/Menu";

function Note({ handleLogout }) {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [addFormIsOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const sessionData = localStorage.getItem("userSession");

    if (!sessionData) {
      toast.error("⚠️ Session expired. Please log in again.", { autoClose: 2000 });
      navigate("/");
      return;
    }

    const userSession = JSON.parse(sessionData);

    if (!userSession?.id) {
      toast.error("⚠️ Invalid session. Please log in again.", { autoClose: 2000 });
      navigate("/");
      return;
    }

    fetchUserNotes(userSession.id);
  }, []);

  const fetchUserNotes = async (userId) => {
    try {
      const notesRef = collection(db, "notes");
      const q = query(notesRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const userNotes = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          ...data,
          dateSaved: data.dateSaved?.toDate() || new Date(),
        };
      });

      setBlogs(userNotes);
      if (userNotes.length > 0) setSelectedBlog(userNotes[0]);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("⚠️ Error fetching notes!");
    }
  };

  const openForm = () => setIsOpen(true);
  const closeForm = () => {
    setIsOpen(false);
    setTitle("");
    setCategory("");
    setContent("");
  };

  const handleSubmit = async () => {
    const sessionData = localStorage.getItem("userSession");
    if (!sessionData) {
      toast.error("⚠️ User not found. Please log in again.", { autoClose: 2000 });
      return;
    }

    const userSession = JSON.parse(sessionData);

    if (!title || !category || !content) {
      toast.warn("⚠️ Please fill in all fields!", { autoClose: 2000 });
      return;
    }

    await handleSaveNote(title, category, content, userSession.id, closeForm, setTitle, setCategory, setContent);
    fetchUserNotes(userSession.id);
  };

  const filteredBlogs = blogs.filter((blog) =>
  blog.title.toLowerCase().includes(search.toLowerCase()) ||
  blog.category.toLowerCase().includes(search.toLowerCase())
);

  const renderHighlightedContent = (htmlContent) => {
    const regex = /<pre><code class="language-(.*?)">(.*?)<\/code><\/pre>/gs;
    let elements = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(htmlContent)) !== null) {
      const [fullMatch, language, code] = match;

      if (lastIndex < match.index) {
        elements.push(
          <div key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: htmlContent.substring(lastIndex, match.index) }} />
        );
      }

      elements.push(
        <pre key={`code-${match.index}`} className="code-container">
          <SyntaxHighlighter language={language} style={materialDark}>
            {code}
          </SyntaxHighlighter>
        </pre>
      );

      lastIndex = match.index + fullMatch.length;
    }

    if (lastIndex < htmlContent.length) {
      elements.push(
        <div key={`text-end`} dangerouslySetInnerHTML={{ __html: htmlContent.substring(lastIndex) }} />
      );
    }

    return elements;
  };

  return (
    <div className="container">
      <div className="sidebar">
        <div className="search-bar fixed">
          <div className="menu-bar">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <button onClick={openForm} className="btnSuccess">
              <FaPlusCircle size={15} className="menuIcon" />
              New
            </button>
          </div>
        </div>

        <div className="blog-list">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className={`blog-item ${selectedBlog?.id === blog.id ? "active" : ""}`}
                onClick={() => setSelectedBlog(blog)}
              >
                <p className="mainText">{blog.title}</p>
                <small className="subText">(category: {blog.category})</small>
                <br />
                <code className="subText">{format(blog.dateSaved, "MMM dd, yyyy h:mm a")}</code>
                <FaRegEdit size={15} className="menuIcon" style={{border:"1 px solid #8a8a8a",
                  marginLeft:"80px"}} />
              </div>
            ))
          ) : (
            <div className="whiteText">No results found for "{search}"</div>
          )}
        </div>
      </div>

      <div className="content fixed-container">
        <div className="userDiv fixed">
          <Menu handleLogout={handleLogout} />
        </div>

        <div className="note-content">
          {addFormIsOpen && (
            <div className="addNoteForm">
              <div className="formContainer">
                <div>
                  <div class="col-md-12 row">
                    <div class="col-md-11"><h3>Adding New Note</h3>
                    </div>
                    <div class="col-md-1" style={{textAlign:"right"}}>
                      <button onClick={closeForm} className="closeBtn">
                        <FaTimes size={10} />
                      </button>
                    </div>
                  </div><hr/><br/>
                  <div className="col-md-12">
                    <input type="text" className="border p-2 w-full mb-4" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div><br/>
                  <div className="col-md-12">
                    <input type="text" className="border p-2 w-full mb-4" placeholder="Enter Category" value={category} onChange={(e) => setCategory(e.target.value)} />
                  </div><br/>
                  <RichTextEditor onChange={setContent} /><br/>
                  <button onClick={handleSubmit} className="btnSuccess">
                    <FaSave size={17} className="menuIcon" /> Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedBlog ? (
            <>
              <div className="titleDiv"><h2>{selectedBlog.title}</h2></div>
              
              <div className="contentDiv">{renderHighlightedContent(selectedBlog.content)}</div>
            </>
          ) : (
            <p>No notes available.</p>
          )}
        </div>
      </div>
      {/*Footer Section */}
      <footer className="footer" style={{marginTop:"60px"}}>
        <small><code>&copy;{new Date().getFullYear()}  mac22.</code></small>
      </footer>
    </div>
  );
}

export default Note;
