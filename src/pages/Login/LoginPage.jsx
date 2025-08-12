import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust if needed
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginPage.css';
import Logo from '../assets/yellowlogo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState('crackers'); // 'electronics' or 'crackers'
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/newhome');
    } catch (error) {
      toast.error('Incorrect email or password');
    }
  };

  return (
    <div className={`login-container variant-${theme}`}>
      <ToastContainer />
      <div className="login-form">
        <div className="login-form-inner">
          <div className="logo">
            <img src={Logo} height="160px" width="150px" alt="Logo" />
          </div>
          <h4 className="login-title">YELLOW CRACKERS BILLING SOFTWARE</h4>

          <div className="sign-in-seperator">
            <span>LOGIN</span>
          </div>

          <form onSubmit={handleLogin}>
            <div className="login-form-group input-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
              />
              <label htmlFor="email" className="user-label">
                Email <span className="required-star">*</span>
              </label>
            </div>
            <div className="login-form-group input-group">
              <input
                autoComplete="off"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
              />
              <label htmlFor="password" className="user-label">
                Password <span className="required-star">*</span>
              </label>
            </div>

            <button type="submit" className="rounded-button login-cta">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
