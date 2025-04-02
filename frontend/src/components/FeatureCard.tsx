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
      <div className="relative flex flex-col items-center justify-center rounded-md overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3c3fdd] to-[#772abe] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[24px]"></div>
        <div className="relative flex flex-col items-center space-y-4 rounded-lg p-6 bg-white w-full transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]">
          <div className="rounded-full bg-primary/2 p-3">
            {icon}
          </div>
          <h3 className="text-3xl font-medium text-[#2e31ce]">
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
    <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-[0px_0px_10px_rgba(0,0,0,1)] bg-white">
      <div className="rounded-full bg-primary/2 p-3">
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