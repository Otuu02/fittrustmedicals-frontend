// src/components/order/CountdownTimer.tsx
import { useTimer } from '@/hooks/useTimer';

interface CountdownTimerProps {
  endTime: Date | string;
  label?: string;
}

export const CountdownTimer = ({ endTime, label = 'Offer ends in' }: CountdownTimerProps) => {
  const { timeLeft, isExpired } = useTimer(endTime);

  if (isExpired) {
    return <div className="text-red-600 font-semibold text-sm">Offer Expired</div>;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <p className="text-xs text-gray-600 mb-2">{label}</p>
      <div className="flex gap-2">
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-red-600">{timeLeft.days}</span>
          <span className="text-xs text-gray-600">Days</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-red-600">{timeLeft.hours}</span>
          <span className="text-xs text-gray-600">Hours</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-red-600">{timeLeft.minutes}</span>
          <span className="text-xs text-gray-600">Mins</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-red-600">{timeLeft.seconds}</span>
          <span className="text-xs text-gray-600">Secs</span>
        </div>
      </div>
    </div>
  );
};