import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBars,FaHome,FaRegStickyNote,FaSignOutAlt } from "react-icons/fa"; // Importing icons
import './Menu.css'


function Menu({ handleLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectOption = (option) => {
    setIsOpen(false);
    if (option === 'Home') {
      navigate('/');
    } else if (option === 'Note') {
      navigate('/note');
    } else if (option === 'Logout') {
      handleLogout(); // Clear session and update state
      navigate('/'); // Redirect to login
    }
  };

  return (
    <div className="userContainer">
      {/* Username */}
      <span className="username">
        <FaUser size={16} className="menuIcon" />
        {JSON.parse(localStorage.getItem("userSession"))?.username || "Guest"}
      </span>

      {/* Menu Icon */}
      <button onClick={toggleDropdown} className="menuFa">
        <FaBars size={18} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="dropdownMenu">
          <li onClick={() => handleSelectOption('Home')} className='li-menu'><FaHome size={20} className="menuIcon" />Home</li>
          <li onClick={() => handleSelectOption('Note')} className='li-menu'><FaRegStickyNote size={18} className="menuIcon" />Note</li>
          <li onClick={() => handleSelectOption('Logout')} className='li-menu'><FaSignOutAlt size={18} className="menuIcon" />Logout</li>
        </ul>
      )}
    </div>
  );
}

export default Menu;
