import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Ensure this matches your backend URL setup
const REGISTER_URL = 'http://localhost:5000/api/auth/register'; 

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student', // Default role for registration
    branch: 'CSE',   // Default branch for registration
  });
  const [error, setError] = useState(null); 
  const [message, setMessage] = useState(null);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    setMessage(null);

    try {
      const response = await axios.post(REGISTER_URL, formData);
      
      setMessage(response.data.message || "Registration successful! Redirecting to login...");
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login'); 
      }, 1500);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); 
      } else {
        setError('Registration failed. Check server status.');
        console.error('Registration Error:', err);
      }
    }
  };

  return (
    <div className="auth-form-container">
      <h2>CampusHub Register</h2>
      
      {error && <p style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{error}</p>}
      {message && <p style={{ color: 'green', marginBottom: '15px', fontWeight: 'bold' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Campus Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {/* Password */}
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Role Selection */}
        <div className="form-group">
          <select 
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ width: '100%', padding: '12px 15px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px' }}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>

        {/* Branch Selection */}
        <div className="form-group">
          <select 
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            style={{ width: '100%', padding: '12px 15px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px' }}
          >
            <option value="CSE">CSE</option>
            <option value="EEE">EEE</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
            <option value="General">General</option>
          </select>
        </div>
        
        <button type="submit">Register</button>
      </form>
      
      <p style={{ marginTop: '20px', fontSize: '14px' }}>
        Already have an account? <Link to="/login" style={{ color: '#004a99', textDecoration: 'none' }}>Log In here</Link>
      </p>
    </div>
  );
}

export default Register;