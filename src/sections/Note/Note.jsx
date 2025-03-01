import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../common/ThemeContext';
import './Note.css';
import userIcon from '../../assets/user-286.png';
import Menu from '../Menu/Menu';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleSaveNote } from "../Functions/system_functions";

const blogs = [
  { id: 1, title: "Understanding React Hooks", category: "react", content: "Hooks allow you to use state and other React features without writing a class..." },
  { id: 2, title: "JavaScript ES6 Features", category: "javascript", content: "ES6 introduced many features like arrow functions, template literals, and destructuring..." },
  { id: 3, title: "React Components", category: "react", content: "Components are the heart of React apps. You can create reusable UI elements with them..." },
  { id: 20, title: "JavaScript Promises", category: "javascript", content: "Promises allow you to handle asynchronous operations in JavaScript..." },
  { id: 21, title: "CSS Grid vs Flexbox", category: "css", content: "CSS Grid and Flexbox are both layout systems in CSS, but they are used for different purposes..." }
];

function Note({ handleLogout }) {
  const { theme } = useTheme(); 
  const [search, setSearch] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(blogs[0]);
  const navigate = useNavigate();
  const [addFormIsOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");  // Fix: Add state for title
  const [category, setCategory] = useState("");  // Fix: Add state for title
  const [content, setContent] = useState("");  // Fix: Add state for content
  const userSession = JSON.parse(localStorage.getItem('userSession'));

  const openForm = () => setIsOpen(true);
  const closeForm = () => {
    setIsOpen(false);
    setTitle(""); // Reset title on close
    setCategory(""); // Reset title on close
    setContent(""); // Reset content on close
  };

  const handleSubmit = () => {
    if (!userSession || !userSession.id) {
      toast.error("⚠️ User not found. Please log in again.", { autoClose: 2000 });
      return;
    }
    
    if (!title || !content) {
      toast.warn("⚠️ Please fill in all fields!", { autoClose: 2000 });
      return;
    }
    
    handleSaveNote(title, category, content, userSession.id, closeForm, setTitle, setContent);
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="sidebar fixed-container">
        <div className="search-bar fixed">
          <div className="menu-bar">Menu</div>
          <input
            type="text"
            placeholder="Search blog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={openForm}>Add New</button>
        </div>
        <div className='space' />

        <div className="blog-list scrollable">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className={`blog-item ${selectedBlog.id === blog.id ? "active" : ""}`}
                onClick={() => setSelectedBlog(blog)}
              >
                {blog.title} ({blog.category})
              </div>
            ))
          ) : (
            <div className='whiteText'>No results found for "{search}"</div>
          )}
        </div>
      </div>

      <div className="content fixed-container">
        <div className="userDiv fixed">
          <img className='currentUser' src={userIcon} alt="User" /> {userSession ? userSession.username : "Guest"}
          <Menu handleLogout={handleLogout}/>
        </div>
        <div className='space' />
        <div className="note-content">
          {/* Adding Note Form */}
          {addFormIsOpen && (
            <div className="addNoteForm">
              <div className="form-container" style={{ backgroundColor: "white", color: "black" }}>
                <div style={{ textAlign: "right", display: "flex", alignItems: "right", justifyContent: "right", width: "100%" }}>
                  <button className="close-button" onClick={closeForm}>✖</button>
                </div>
                <h2 style={{ backgroundColor: "white", color: "black" }}>Adding New Note</h2><hr></hr>
                
                <div className="w-full bg-gray-200 p-4 text-center">
                  <input 
                    type="text" 
                    placeholder="Enter title" 
                    className="border p-2 w-full mb-4" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <br></br>

                <div className="w-full bg-gray-200 p-4 text-center">
                  <input 
                    type="text" 
                    placeholder="Enter Category" 
                    className="border p-2 w-full mb-4" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>

                <br></br>
                
                <div className="w-full bg-gray-200 p-4 text-center">
                  <textarea 
                    className="border p-2 w-full mb-4 noteTextArea" 
                    placeholder="Enter your note here..." 
                    rows="18"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                </div>
                
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
          {/* End of Adding Note Form */}

          <h1>{selectedBlog.title}</h1>
          <p>{selectedBlog.content}</p>
        </div>
      </div>
    </div>
  );
}

export default Note;
