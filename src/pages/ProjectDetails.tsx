import React from 'react';
import { useParams } from 'react-router-dom';

function ProjectDetails() {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Project Details</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Loading project {id}...</p>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;