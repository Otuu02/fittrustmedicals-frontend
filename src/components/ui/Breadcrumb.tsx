'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className="text-blue-600 hover:underline font-medium text-sm"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-600 font-medium text-sm">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <ChevronRight size={16} className="text-gray-400" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}