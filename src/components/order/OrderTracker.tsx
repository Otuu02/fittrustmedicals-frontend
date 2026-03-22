// src/components/order/OrderTracker.tsx
import { Check, Truck, Package, Home } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  completed: boolean;
  icon: React.ReactNode;
}

interface OrderTrackerProps {
  currentStep: number;
}

export const OrderTracker = ({ currentStep }: OrderTrackerProps) => {
  const steps: Step[] = [
    { id: 1, label: 'Order Confirmed', completed: currentStep >= 1, icon: <Check size={20} /> },
    { id: 2, label: 'Processing', completed: currentStep >= 2, icon: <Package size={20} /> },
    { id: 3, label: 'Shipped', completed: currentStep >= 3, icon: <Truck size={20} /> },
    { id: 4, label: 'Delivered', completed: currentStep >= 4, icon: <Home size={20} /> },
  ];

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-lg font-bold mb-6">Order Status</h2>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            {/* Icon Circle */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                step.completed
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step.icon}
            </div>

            {/* Label */}
            <p className={`text-sm font-medium text-center ${
              step.completed ? 'text-green-600' : 'text-gray-600'
            }`}>
              {step.label}
            </p>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute h-1 w-1/4 ml-12 mt-0 transition-all ${
                  step.completed ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};