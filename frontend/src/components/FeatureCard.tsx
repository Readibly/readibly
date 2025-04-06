"use client";


interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  isHover?: boolean;
}

export default function FeatureCard({ icon, title, description, isHover = false }: FeatureCardProps) {
  if (isHover) {
    return (
      <div className="group relative flex flex-col items-center space-y-4 p-6 bg-white rounded-lg border border-[#e0e0e0] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="rounded p-3">
          {icon}
        </div>
        <h3 className="text-3xl font-medium text-[#2e31ce]">
          {title}
        </h3>
        <p className="text-center text-muted-foreground">
          {description}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg border border-[#e0e0e0] shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="rounded p-3">
        {icon}
      </div>
      <h3 className="text-3xl font-medium text-[#7678ed]">
        {title}
      </h3>
      <p className="text-center text-muted-foreground">
        {description}
      </p>
    </div>
  );
} 