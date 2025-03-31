"use client";

import { Eye, Headphones, BookOpen } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  is3D?: boolean;
}

export default function FeatureCard({ icon, title, description, is3D = false }: FeatureCardProps) {
  if (is3D) {
    return (
      <div className="relative flex flex-col items-center justify-center rounded-[14px] z-[1111] overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl" style={{perspective: '1000px'}}>
        <div 
          className="flex flex-col items-center space-y-4 rounded-lg p-6 bg-white relative w-full transition-all duration-300 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] border-2 border-purple-600 hover:border-purple-400" 
          style={{transform: 'translateZ(20px)'}} 
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            e.currentTarget.style.transform = `translateZ(20px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          }} 
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateZ(20px)';
          }}
        >
          <div className="rounded-full bg-primary/2 p-3">
            {icon}
          </div>
          <h3 className="text-3xl font-bold text-purple-600">
            {title}
          </h3>
          <p className="text-center text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-xl bg-white">
      <div className="rounded-full bg-primary/2 p-3">
        {icon}
      </div>
      <h3 className="text-3xl font-bold text-purple-600">
        {title}
      </h3>
      <p className="text-center text-muted-foreground">
        {description}
      </p>
    </div>
  );
} 