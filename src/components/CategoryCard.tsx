
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
  link: string;
}

const CategoryCard = ({ icon, title, description, color, link }: CategoryCardProps) => {
  return (
    <Link 
      to={link} 
      className="category-card flex flex-col items-center text-center p-4 transition-all duration-300 hover:scale-105"
    >
      <div 
        className={cn(
          `w-16 h-16 ${color} rounded-xl flex items-center justify-center mb-3`,
          "shadow-md category-icon relative overflow-hidden",
          "after:absolute after:inset-0 after:bg-white/10 after:opacity-0 after:transition-opacity after:duration-300",
          "hover:after:opacity-100"
        )}
      >
        <div className="z-10 relative">
          {icon}
        </div>
      </div>
      <h3 className="font-medium text-sm mb-1 transition-colors duration-300">{title}</h3>
      <p className="text-xs text-gray-400 line-clamp-2 transition-opacity duration-300">{description}</p>
    </Link>
  );
};

export default CategoryCard;
