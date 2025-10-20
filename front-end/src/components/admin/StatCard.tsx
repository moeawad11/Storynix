import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = "indigo",
}) => {
  return (
    <div
      className={`flex items-center justify-between p-6 rounded-xl shadow-lg bg-white border-l-8 border-${color}-500`}
    >
      <div>
        <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
        <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1">
          {value}
        </p>
      </div>
      {icon && (
        <div
          className={`p-3 rounded-full bg-${color}-100 text-${color}-600 flex items-center justify-center`}
        >
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;
