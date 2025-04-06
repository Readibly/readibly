"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Template {
  id: number;
  title: string;
  category: string;
  content: string;
}

const templates: Template[] = [
  {
    id: 1,
    title: "The Little Red Riding Hood",
    category: "fairytale",
    content:
      "Once upon a time, there was a little girl who lived in a village near the forest. She was known to everyone as Little Red Riding Hood because of the red cloak she always wore. One day, her mother asked her to take some food to her grandmother who was sick and lived in a house in the forest. Little Red Riding Hood was happy to help and set off on her journey.",
  },
  {
    id: 2,
    title: "The Three Little Pigs",
    category: "fairytale",
    content:
      "There were three little pigs who lived with their mother. One day, their mother told them they were old enough to go out into the world and make their own way. The first pig built his house out of straw, the second pig built his house out of sticks, and the third pig built his house out of bricks.",
  },
  {
    id: 3,
    title: "Solar System Facts",
    category: "facts",
    content:
      "The solar system consists of the Sun and the objects that orbit around it. The Sun is a star at the center of our solar system. There are eight planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Earth is the only planet known to support life.",
  },
  {
    id: 4,
    title: "Ocean Life",
    category: "facts",
    content:
      "The ocean covers more than 70 percent of Earth's surface. It is home to countless species of plants and animals. The blue whale is the largest animal on Earth, growing up to 100 feet long. Coral reefs are some of the most diverse ecosystems on the planet.",
  },
  {
    id: 5,
    title: "Space Exploration",
    category: "facts",
    content:
      "Humans first landed on the Moon in 1969. The International Space Station has been continuously occupied for over 20 years. Mars is the most explored planet in our solar system. Space probes have visited all the planets in our solar system.",
  },
];

export default function TemplatesPage() {
  const router = useRouter();

  const handleTemplateSelect = (template: Template) => {
    router.push(`/learn/read?template=${template.id}`);
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-between items-center"
        >
          <div>
            <Link
              href="/learn"
              className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning Center
            </Link>
            <h1 className="text-3xl font-bold">Reading Templates</h1>
            <p className="text-gray-600 mt-2">
              Choose a template to practice reading
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {templates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleTemplateSelect(template)}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-2">{template.title}</h2>
              <p className="text-sm text-gray-600 capitalize mb-4">
                {template.category}
              </p>
              <p className="text-sm text-gray-500 line-clamp-3">
                {template.content}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
