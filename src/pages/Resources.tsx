import React from 'react';
import Card from '../components/common/Card';

const resources = [
  {
    category: 'Websites',
    items: [
      {
        name: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/',
        description: 'Interactive coding lessons and projects for web development, data science, and more.',
      },
      {
        name: 'MDN Web Docs',
        url: 'https://developer.mozilla.org/',
        description: 'Comprehensive documentation and guides for HTML, CSS, JavaScript, and web APIs.',
      },
      {
        name: 'W3Schools',
        url: 'https://www.w3schools.com/',
        description: 'Beginner-friendly tutorials and references for web technologies.',
      },
    ],
  },
  {
    category: 'YouTube Channels',
    items: [
      {
        name: 'Fireship',
        url: 'https://www.youtube.com/c/Fireship',
        description: 'High-energy, concise programming tutorials and tech overviews.',
      },
      {
        name: 'The Net Ninja',
        url: 'https://www.youtube.com/c/TheNetNinja',
        description: 'In-depth coding tutorials on web development, JavaScript, React, and more.',
      },
      {
        name: 'Academind',
        url: 'https://www.youtube.com/c/Academind',
        description: 'Clear explanations of web development concepts and frameworks.',
      },
    ],
  },
  {
    category: 'Articles & Blogs',
    items: [
      {
        name: 'CSS-Tricks',
        url: 'https://css-tricks.com/',
        description: 'Tips, tricks, and tutorials for CSS and front-end development.',
      },
      {
        name: 'Smashing Magazine',
        url: 'https://www.smashingmagazine.com/',
        description: 'Articles on web design, development, UX, and more.',
      },
      {
        name: 'DEV Community',
        url: 'https://dev.to/',
        description: 'A community of developers sharing articles, tutorials, and discussions.',
      },
    ],
  },
];

const Resources: React.FC = () => (
  <div className="min-h-screen bg-black py-12">
    <div className="container mx-auto px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Learning Resources</h1>
        <p className="text-lg text-custom-cyan">Curated articles, websites, and channels to help you learn programming and tech skills.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((section) => (
          <div key={section.category}>
            <h2 className="text-2xl font-semibold text-custom-orange mb-4">{section.category}</h2>
            <div className="space-y-4">
              {section.items.map((item) => (
                <Card key={item.name} className="bg-black border border-custom-cyan text-white hover:shadow-lg transition-shadow">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h3 className="text-xl font-bold text-custom-cyan mb-1">{item.name}</h3>
                    <p className="text-neutral-300">{item.description}</p>
                  </a>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Resources;
