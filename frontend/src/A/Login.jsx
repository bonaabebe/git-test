import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';
import FacebookSharpIcon from '@mui/icons-material/FacebookSharp';
import GoogleIcon from '@mui/icons-material/Google';
import XIcon from '@mui/icons-material/X';

function Login() {
  const [formData, setFormData] = useState({
    username: '', // Change from 'name' to 'username' for clarity
    password: '',
  });

  const navigate = useNavigate();
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Frontend login logic - Storing role in localStorage
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    // Send the correct fields (username, password) to the backend
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username, // Correct field name: 'username'
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);  // Store role in localStorage
      setSnackbarMessage('Login successful!');
      setSnackbarOpen(true);

      // Redirect based on role
      switch (data.user.role) {
        case 'Admin':
          navigate('/admin');
          break;
     case 'Prison Manager':
          navigate('/manager')
          break;
        case 'Staff Member':
          navigate('/staff');
          break;
        default:
          navigate('/unauthorized');
      }
    } else {
      setSnackbarMessage(data.message || 'Login failed!');
      setSnackbarOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container">
      <div className="left-panel">
        <h1>Welcome Back!</h1>
        <p>To keep connected with us, please log in with your personal info.</p>
      </div>
      <div className="right-panel">
        <h2>Login</h2>
     
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label htmlFor="login-username">Username</label>
            <input
              type="text"
              id="login-username"
              name="username"  // This will correspond to formData.username
              className="input-common"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              name="password"
              className="input-common"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="signup-button">Login</button>
        </form>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
}

export default Login;
