import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const LOGIN_URL = 'http://localhost:5000/api/auth/login';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      const response = await axios.post(LOGIN_URL, {
        email: email,
        password: password,
      });

      const { token, role, branch } = response.data;
      
      if (token && role && branch) {
        // Store all necessary details
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);      
        localStorage.setItem('userBranch', branch);  
        
        navigate('/dashboard', { replace: true }); 
      } else {
        setError('Login failed: Authentication data missing. Backend did not return token, role, or branch.');
      }
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); 
      } else if (err.response) {
        setError(`Login failed: ${err.response.data.message || err.response.statusText}. Check server logs.`);
      } else {
        setError('Connection Error: The server is unreachable or offline.');
      }
    }
  };

  return (
    <div className="auth-form-container">
      <h2>CampusHub Login</h2>
      {error && <p style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Campus Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit">Log In</button>
      </form>
      <p style={{ marginTop: '20px', fontSize: '14px' }}>
        Don't have an account? <Link to="/register" style={{ color: '#004a99', textDecoration: 'none' }}>Register here</Link>
      </p>
    </div>
  );
}

export default Login;