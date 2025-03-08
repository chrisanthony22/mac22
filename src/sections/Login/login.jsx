import { useState } from "react";
import "./login.css";
import { handleLoginSubmit } from "../Functions/system_functions";
import { FaSignInAlt } from "react-icons/fa";

function Login({ closePopup, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginSubmit(email, password, closePopup, onLoginSuccess);
  };

  return (
    <div >
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required className="inputLogin"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required className="inputLogin"
        />
        <button type="submit" className="btnSuccess"><FaSignInAlt size={15} className='menuIcon'/>Login</button>
      </form>
    </div>
  );
}

export default Login;
