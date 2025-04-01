'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface Template {
  id: number;
  title: string;
  category: 'fairytale' | 'facts';
  description: string;
  content: string;
}

const templates: Template[] = [
  {
    id: 1,
    title: "The Little Red Riding Hood",
    category: "fairytale",
    description: "A classic fairy tale about a young girl's encounter with a wolf.",
    content: "Once upon a time, there was a little girl who lived in a village near the forest. She was known to everyone as Little Red Riding Hood because of the red cloak she always wore. One day, her mother asked her to take some food to her grandmother who was sick and lived in a house in the forest. Little Red Riding Hood was happy to help and set off on her journey."
  },
  {
    id: 2,
    title: "The Three Little Pigs",
    category: "fairytale",
    description: "A story about three pigs building houses and facing a big bad wolf.",
    content: "There were three little pigs who lived with their mother. One day, their mother told them they were old enough to go out into the world and make their own way. The first pig built his house out of straw, the second pig built his house out of sticks, and the third pig built his house out of bricks."
  },
  {
    id: 3,
    title: "Solar System Facts",
    category: "facts",
    description: "Interesting facts about our solar system and its planets.",
    content: "The solar system consists of the Sun and the objects that orbit around it. The Sun is a star at the center of our solar system. There are eight planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Earth is the only planet known to support life."
  },
  {
    id: 4,
    title: "Ocean Life",
    category: "facts",
    description: "Fascinating facts about ocean life and marine creatures.",
    content: "The ocean covers more than 70 percent of Earth's surface. It is home to countless species of plants and animals. The blue whale is the largest animal on Earth, growing up to 100 feet long. Coral reefs are some of the most diverse ecosystems on the planet."
  },
  {
    id: 5,
    title: "Space Exploration",
    category: "facts",
    description: "Key facts about human space exploration and achievements.",
    content: "Humans first landed on the Moon in 1969. The International Space Station has been continuously occupied for over 20 years. Mars is the most explored planet in our solar system. Space probes have visited all the planets in our solar system."
  }
];

export default function LearnPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'fairytale' | 'facts'>('all');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FDFCF4]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Learn with Templates</h1>
          <p className="text-sm font-light text-gray-600">Choose a template to practice reading</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === 'all'
                ? 'bg-violet-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategory('fairytale')}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === 'fairytale'
                ? 'bg-violet-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Fairy Tales
          </button>
          <button
            onClick={() => setSelectedCategory('facts')}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === 'facts'
                ? 'bg-violet-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Facts
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/learn-text/${template.id}`)}
            >
              <h2 className="text-xl font-semibold mb-2">{template.title}</h2>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-violet-500 capitalize">{template.category}</span>
                <button className="text-violet-500 hover:text-violet-600">
                  Start Reading →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
