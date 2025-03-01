import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <button onClick={toggleDropdown}>Menu</button>
      {isOpen && (
        <ul>
          <li onClick={() => handleSelectOption('Home')}>Home</li>
          <li onClick={() => handleSelectOption('Note')}>Note</li>
          <li onClick={() => handleSelectOption('Logout')}>Logout</li>
        </ul>
      )}
    </div>
  );
}

export default Menu;
