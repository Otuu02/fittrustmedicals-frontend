// src/components/ui/ProductIcon.tsx
'use client';

export default function ProductIcon({ type, className = "" }: { type: string; className?: string }) {
  const icons: Record<string, string> = {
    medical: "🩺",
    thermometer: "🌡️",
    heart: "❤️",
    pills: "💊",
    microscope: "🔬",
    stethoscope: "🩺",
    syringe: "💉",
    bandage: "🩹",
    delivery: "🚚",
    package: "📦",
    location: "📍",
    target: "🎯"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="text-6xl">{icons[type] || "🏥"}</span>
    </div>
  );
}