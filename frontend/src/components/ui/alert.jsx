import React from 'react';

export function Alert({ children, variant = 'default' }) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={`p-4 rounded-lg ${getVariantClasses()}`}>
      {children}
    </div>
  );
}

export function AlertDescription({ children }) {
  return <div className="text-sm">{children}</div>;
}