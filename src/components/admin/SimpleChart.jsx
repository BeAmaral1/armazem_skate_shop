import React from 'react';

// Componente de gráfico de barras simples (sem bibliotecas externas)
export const BarChart = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percentage = (item.value / maxValue) * 100;
        
        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">{item.label}</span>
              <span className="text-gray-900 font-semibold">{item.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-dark-600 to-dark-800 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Componente de gráfico de linha simples
export const LineChart = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - (((item.value - minValue) / range) * 100);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-4">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ height: `${height}px` }}
        className="w-full"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        ))}

        {/* Area under line */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#gradient)"
          opacity="0.2"
        />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (((item.value - minValue) / range) * 100);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill="#1a1a1a"
            />
          );
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
      </svg>

      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-500">
        {data.map((item, index) => (
          <span key={index}>{item.label}</span>
        ))}
      </div>
    </div>
  );
};

// Componente de gráfico de pizza (donut) simples
export const DonutChart = ({ data, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const colors = [
    '#1a1a1a', // dark
    '#f97316', // orange
    '#10b981', // green
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ef4444', // red
  ];

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20" />
        
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const radius = 40;
          const circumference = 2 * Math.PI * radius;
          const offset = circumference - (percentage / 100) * circumference;
          
          const rotation = currentAngle - 90;
          currentAngle += angle;

          return (
            <circle
              key={index}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={colors[index % colors.length]}
              strokeWidth="20"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform={`rotate(${rotation} 50 50)`}
              className="transition-all duration-500"
            />
          );
        })}

        {/* Center text */}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xl font-bold"
          fill="#1a1a1a"
        >
          {total}
        </text>
      </svg>

      {/* Legend */}
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-700">
                {item.label}: <span className="font-semibold">{item.value}</span> ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default { BarChart, LineChart, DonutChart };
