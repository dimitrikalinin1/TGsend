"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor, 
  description,
  trend,
  className 
}: StatCardProps) => {
  return (
    <Card className={cn("neo-card floating-card group overflow-hidden relative", className)}>
      <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
            {title}
          </CardTitle>
          <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
          
          {description && (
            <div className="text-xs text-gray-500 font-medium">{description}</div>
          )}
          
          {trend && (
            <div className="flex items-center space-x-1">
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500">vs прошлый месяц</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};