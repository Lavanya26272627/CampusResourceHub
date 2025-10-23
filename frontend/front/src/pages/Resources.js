// frontend-react/src/pages/Resources.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResourceCard from '../components/ResourceCard'; 
import { useNavigate, Link } from 'react-router-dom';

const RESOURCES_URL = 'http://localhost:5000/api/resources'; 

function Resources() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole'); 

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.get(RESOURCES_URL, config);
                setResources(response.data);
            } catch (err) {
                console.error("Fetch error:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    navigate('/login'); 
                }
                setError(err.message || "Failed to load resources.");
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, [navigate]);

    return (
        <div className="dashboard-container">
            <h2>{userRole === 'faculty' ? 'Manage Resources' : 'Available Academic Resources'}</h2>

            {/* Faculty View: Link to the CreateResource form */}
            {userRole === 'faculty' && (
                <Link to="/create-resource" // 🔑 CORRECT LINK PATH 🔑
                    style={{ textDecoration: 'none' }}
                >
                    <button 
                        className="create-button" 
                        style={{ marginBottom: '20px', padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        + Create New Resource
                    </button>
                </Link>
            )}

            {loading && <p>Loading resources...</p>}
            
            {error && <p style={{ color: 'red' }}>Error loading data: {error}</p>}

            {!loading && !error && (
                <>
                    {resources.length === 0 ? (
                        <div className="empty-state" style={{ padding: '30px', textAlign: 'center', border: '1px dashed #ccc', margin: '20px 0' }}>
                            <p style={{ fontSize: '1.2em', color: '#888' }}>
                                No resources are currently available. Check back later!
                            </p>
                            {userRole === 'faculty' && (
                                <p style={{ color: '#007bff', marginTop: '10px' }}>Use the button above to publish new content.</p>
                            )}
                        </div>
                    ) : (
                        <div className="resource-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {resources.map(resource => (
                                <ResourceCard key={resource._id} resource={resource} userRole={userRole} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Resources;
