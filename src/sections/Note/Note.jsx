import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../common/ThemeContext';
import './Note.css';
import userIcon from '../../assets/user-286.png';
import Menu from '../Menu/Menu';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleSaveNote } from "../Functions/system_functions";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { format } from "date-fns";
import { FaUser, FaBars, FaPlusCircle, FaSearch,FaTimes } from "react-icons/fa"; // Importing icons

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

      const userNotes = querySnapshot.docs.map(doc => {
          const data = doc.data();
      
          return {
              id: doc.id,
              ...data,
              dateSaved: data.dateSaved?.toDate() || new Date(), // Convert Firestore Timestamp
          };
      });
      console.log("userNotes : ", userNotes)

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

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="sidebar fixed-container">
        <div className="search-bar fixed">
          <div className="menu-bar">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search blog..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <button onClick={openForm} className="btnSuccess"><FaPlusCircle size={15} />New</button>
          </div>
        </div>
        <div className='space' />

        <div className="blog-list">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className={`blog-item ${selectedBlog?.id === blog.id ? "active" : ""}`}
                onClick={() => setSelectedBlog(blog)}
              >
                <p className='mainText'>{blog.title}</p>
                <small className='subText'>(category: {blog.category})</small><br/>
                 <code className='subText'>{format(blog.dateSaved, "MMM dd, yyyy h:mm a")}</code>
              </div>
            ))
          ) : (
            <div className='whiteText'>No results found for "{search}"</div>
          )}
        </div>
      </div>

      <div className="content fixed-container">
        <div className="userDiv fixed">
          <Menu handleLogout={handleLogout}/>
        </div>
        <div className='space' />
        <div className="note-content">
          {addFormIsOpen && (
            <div className="addNoteForm">
              <div className="formContainer">
              <div className="col-md-12 row">
                <div className="col-md-11">
                  <h3>Adding New Note</h3>
                </div>
                <div className="col-md-1">
                  <button className="close-button" onClick={closeForm} style={{marginLeft:"25px"}}>✖</button>
                </div>
              </div>
              <hr/>
                <input 
                  type="text" 
                  placeholder="Enter title" 
                  className="border p-2 w-full mb-4" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <input 
                  type="text" 
                  placeholder="Enter Category" 
                  className="border p-2 w-full mb-4" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />

                <textarea 
                  className="border p-2 w-full mb-4 noteTextArea" 
                  placeholder="Enter your note here..." 
                  rows="10"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
                
                <div className="flex justify-end gap-2">
                  <button onClick={closeForm} className="bg-gray-500 text-white px-4 py-2 rounded">
                    Close
                  </button>
                  <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedBlog ? (
            <>
              <div className='titleDiv'>
                <h2>{selectedBlog.title}</h2>
              </div>             
              <div className='contentDiv'>
                <p>{selectedBlog.content}</p>
              </div>
            </>
          ) : (
            <p>No notes available.</p>
          )}
        </div>
      </div>

      {/*Footer Section */}
    <footer className="footer">
      <small><code>&copy;{new Date().getFullYear()}  mac22.</code></small>
    </footer>
    </div>
  );
}

export default Note;
