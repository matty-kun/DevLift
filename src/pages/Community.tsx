import React from 'react';

const CommunityPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Community Hub</h1>

      <div className="text-center mb-12">
        <p className="text-lg text-gray-600">
          Connect, collaborate, and learn with fellow innovators and developers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Discussions Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Discussions</h2>
          <p className="text-gray-600 mb-4">
            Engage in conversations, ask questions, and share your knowledge with fellow developers and founders.
          </p>
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
            View Discussions
          </button>
        </div>

        {/* Members Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Members</h2>
          <p className="text-gray-600 mb-4">
            Connect with other members of the DevLift community. Find collaborators for your next big project.
          </p>
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
            Browse Members
          </button>
        </div>

        {/* Events Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Events</h2>
          <p className="text-gray-600 mb-4">
            Check out upcoming webinars, workshops, and networking events hosted by the community.
          </p>
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
            Upcoming Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
