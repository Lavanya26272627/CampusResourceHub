import React from "react";
import "./InternshipCard.css"; // optional CSS for styling

function InternshipCard({ internship }) {
  return (
    <div className="internship-card">
      <h4>{internship.title}</h4>
      <p><strong>Company:</strong> {internship.company}</p>
      <p><strong>Location:</strong> {internship.location}</p>
      {internship.link && (
        <p>
          <a href={internship.link} target="_blank" rel="noopener noreferrer">
            More Info
          </a>
        </p>
      )}
    </div>
  );
}

export default InternshipCard;
