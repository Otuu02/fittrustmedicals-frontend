'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
}

export function Tabs({ items, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id);

  const activeContent = items.find((item) => item.id === activeTab)?.content;

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200 gap-0 overflow-x-auto bg-white rounded-t-lg">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={clsx(
              'px-4 py-3 font-medium border-b-2 transition whitespace-nowrap text-sm md:text-base',
              activeTab === item.id
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-6 p-4">{activeContent}</div>
    </div>
  );
}