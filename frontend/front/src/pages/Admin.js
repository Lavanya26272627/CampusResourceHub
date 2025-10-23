import React, { useState } from "react";
import '../style.css';

function Admin() {
  const [resource, setResource] = useState({ title: "", description: "", link: "" });
  const [internship, setInternship] = useState({ title: "", company: "", location: "", link: "" });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token"); // JWT token from login

  const handleResourceChange = (e) => setResource({ ...resource, [e.target.name]: e.target.value });
  const handleInternshipChange = (e) => setInternship({ ...internship, [e.target.name]: e.target.value });

  const submitResource = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(resource),
      });
      const data = await res.json();
      setMessage(res.ok ? "✅ Resource added!" : data.message);
      if(res.ok) setResource({ title: "", description: "", link: "" });
    } catch (err) {
      setMessage("⚠️ Server error");
    }
  };

  const submitInternship = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(internship),
      });
      const data = await res.json();
      setMessage(res.ok ? "✅ Internship added!" : data.message);
      if(res.ok) setInternship({ title: "", company: "", location: "", link: "" });
    } catch (err) {
      setMessage("⚠️ Server error");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {message && <p className="message">{message}</p>}

      <section>
        <h3>Add Resource</h3>
        <form onSubmit={submitResource}>
          <input name="title" value={resource.title} onChange={handleResourceChange} placeholder="Title" required />
          <input name="description" value={resource.description} onChange={handleResourceChange} placeholder="Description" required />
          <input name="link" value={resource.link} onChange={handleResourceChange} placeholder="Link" />
          <button type="submit">Add Resource</button>
        </form>
      </section>

      <section style={{ marginTop: "30px" }}>
        <h3>Add Internship</h3>
        <form onSubmit={submitInternship}>
          <input name="title" value={internship.title} onChange={handleInternshipChange} placeholder="Title" required />
          <input name="company" value={internship.company} onChange={handleInternshipChange} placeholder="Company" required />
          <input name="location" value={internship.location} onChange={handleInternshipChange} placeholder="Location" required />
          <input name="link" value={internship.link} onChange={handleInternshipChange} placeholder="Link" />
          <button type="submit">Add Internship</button>
        </form>
      </section>
    </div>
  );
}

export default Admin;
