// frontend-react/src/pages/Internships.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InternshipCard from '../components/InternshipCard'; 
import { useNavigate, Link } from 'react-router-dom';

const INTERNSHIPS_URL = 'http://localhost:5000/api/internships'; 

function Internships() {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        const fetchInternships = async () => {
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

                const response = await axios.get(INTERNSHIPS_URL, config);
                setInternships(response.data);
            } catch (err) {
                console.error("Fetch error:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    navigate('/login'); 
                }
                setError(err.message || "Failed to load internships.");
            } finally {
                setLoading(false);
            }
        };

        fetchInternships();
    }, [navigate]);

    return (
        <div className="dashboard-container">
            <h2>{userRole === 'faculty' ? 'Manage Internships' : 'Available Internships'}</h2>

            {/* Faculty View: Link to the CreateInternship form */}
            {userRole === 'faculty' && (
                <Link to="/create-internship" // 🔑 CORRECT LINK PATH 🔑
                    style={{ textDecoration: 'none' }}
                >
                    <button 
                        className="create-button" 
                        style={{ marginBottom: '20px', padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        + Post New Internship
                    </button>
                </Link>
            )}

            {loading && <p>Loading internships...</p>}
            
            {error && <p style={{ color: 'red' }}>Error loading data: {error}</p>}

            {!loading && !error && (
                <>
                    {internships.length === 0 ? (
                        <div className="empty-state" style={{ padding: '30px', textAlign: 'center', border: '1px dashed #ccc', margin: '20px 0' }}>
                            <p style={{ fontSize: '1.2em', color: '#888' }}>
                                No internships are currently available. Check back later!
                            </p>
                            {userRole === 'faculty' && (
                                <p style={{ color: '#007bff', marginTop: '10px' }}>Use the button above to post a new opportunity.</p>
                            )}
                        </div>
                    ) : (
                        <div className="internship-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {internships.map(internship => (
                                <InternshipCard key={internship._id} internship={internship} userRole={userRole} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Internships;
