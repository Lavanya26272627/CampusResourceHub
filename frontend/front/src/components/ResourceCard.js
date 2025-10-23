import React from "react";
import "./ResourceCard.css";

function ResourceCard({ resource }) {
  return (
    <div className="resource-card">
      <h3>{resource.title}</h3>
      <p>{resource.description}</p>
      {resource.link && (
        <a href={resource.link} target="_blank" rel="noopener noreferrer">
          🔗 Visit Resource
        </a>
      )}
    </div>
  );
}

export default ResourceCard;
