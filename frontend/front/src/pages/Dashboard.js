// frontend-react/src/pages/Dashboard.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Resources from './Resources'; // Import the resource page
import Internships from './Internships'; // Import the internship page

function Dashboard() {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');
    const authToken = localStorage.getItem('authToken');

    useEffect(() => {
        // Basic check for authentication
        if (!authToken || !userRole) {
            navigate('/login');
        }
    }, [authToken, userRole, navigate]);

    // If user is not authenticated or data is missing, show nothing or loading state
    if (!authToken || !userRole) {
        return <div>Redirecting to login...</div>;
    }

    // Faculty will see a consolidated dashboard or links to management tools
    if (userRole === 'faculty') {
        return (
            <div className="faculty-dashboard">
                <h1>Faculty Dashboard</h1>
                <p>Welcome back, Faculty member. Use the links below to manage content.</p>
                
                <div className="dashboard-sections">
                    <Resources /> 
                    <Internships />
                </div>
                
                {/* Optional: Add a button to manage user accounts if needed */}
                {/* <button onClick={() => navigate('/admin')}>Manage Accounts</button> */}
            </div>
        );
    } 
    
    // Students will see the feed of available content
    if (userRole === 'student') {
        return (
            <div className="student-dashboard">
                <h1>Student Dashboard</h1>
                <p>Welcome! Here are the latest resources and opportunities for your branch.</p>
                
                <div className="dashboard-sections">
                    <Resources />
                    <Internships />
                </div>
            </div>
        );
    }
    
    // Fallback case
    return <div>Access Denied or Unknown Role.</div>;
}

export default Dashboard;