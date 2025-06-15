interface RadialProgressProps {
  progress: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
}

const RadialProgress: React.FC<RadialProgressProps> = ({
  progress,
  size = 74,
  strokeWidth = 7,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0.04%" stopColor="#0089FF" />
            <stop offset="100.17%" stopColor="#0068FF" />
          </linearGradient>
        </defs>
        <circle
          stroke="#E8E9F1" // Tailwind gray-200
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="url(#progressGradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-300"
        />
      </svg>
      <span className="absolute text-[26px] font-bold text-black">
        {progress}
      </span>
    </div>
  );
};

export default RadialProgress;
