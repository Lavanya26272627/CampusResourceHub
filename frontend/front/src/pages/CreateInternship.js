// frontend-react/src/pages/CreateInternship.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CREATE_INTERNSHIP_URL = 'http://localhost:5000/api/internships'; 

function CreateInternship() {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        duration: '',
        stipend: '',
        requirements: '',
        branch: 'General', 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess('');

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.post(CREATE_INTERNSHIP_URL, formData, config);
            
            setSuccess('Internship posted successfully! Redirecting...');
            
            setTimeout(() => {
                navigate('/internships'); 
            }, 1500);

        } catch (err) {
            console.error("Creation error:", err);
            const errMsg = err.response?.data?.message || 'Failed to post internship.';
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' };
    const groupStyle = { marginBottom: '15px' };

    return (
        <div className="form-container" style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Post New Internship Opportunity</h2>
            
            {success && <p style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                
                <div style={groupStyle}>
                    <label>Job Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} />
                </div>

                <div style={groupStyle}>
                    <label>Company Name</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} required style={inputStyle} />
                </div>

                <div style={groupStyle}>
                    <label>Location (e.g., Remote, Hyderabad)</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} style={inputStyle} />
                </div>
                
                <div style={groupStyle}>
                    <label>Duration (e.g., 6 Months)</label>
                    <input type="text" name="duration" value={formData.duration} onChange={handleChange} style={inputStyle} />
                </div>
                
                <div style={groupStyle}>
                    <label>Stipend / Compensation</label>
                    <input type="text" name="stipend" value={formData.stipend} onChange={handleChange} style={inputStyle} />
                </div>

                <div style={groupStyle}>
                    <label>Requirements / Description</label>
                    <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows="4" style={inputStyle} />
                </div>

                <div style={{...groupStyle, marginBottom: '20px'}}>
                    <label>Target Branch</label>
                    <select name="branch" value={formData.branch} onChange={handleChange} required style={inputStyle}>
                        <option value="General">General (All Branches)</option>
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="EEE">EEE</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Civil">Civil</option>
                        <option value="IT">IT</option>
                    </select>
                </div>

                <button type="submit" disabled={loading}
                    style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {loading ? 'Posting...' : 'Post Internship'}
                </button>
            </form>
        </div>
    );
}

// 🔑 CRITICAL FIX: Ensure DEFAULT EXPORT
export default CreateInternship;