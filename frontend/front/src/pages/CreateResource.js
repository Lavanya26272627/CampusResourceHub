// frontend-react/src/pages/CreateResource.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CREATE_RESOURCE_URL = 'http://localhost:5000/api/resources';

function CreateResource() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        branch: 'General', // Default to General
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    
    // Get user branch to pre-select it in the form
    const userBranch = localStorage.getItem('userBranch') || 'General';

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

            // Send the request to your protected backend route
            await axios.post(CREATE_RESOURCE_URL, formData, config);
            
            setSuccess('Resource created successfully!');
            
            // Navigate back to the dashboard/resource list after a short delay
            setTimeout(() => {
                navigate('/resources'); 
            }, 1500);

        } catch (err) {
            console.error("Creation error:", err);
            const errMsg = err.response?.data?.message || 'Failed to create resource. Check your data and ensure you are logged in as Faculty.';
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Create New Resource</h2>
            
            {success && <p style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label>URL / Link</label>
                    <input
                        type="url"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label>Description (Optional)</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label>Target Branch</label>
                    <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        required
                        // Optionally pre-select the faculty's branch
                        defaultValue={userBranch}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
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
                    {loading ? 'Creating...' : 'Publish Resource'}
                </button>
            </form>
        </div>
    );
}

export default CreateResource;