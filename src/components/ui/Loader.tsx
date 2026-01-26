import React from 'react';

export const Loader = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex space-x-2">
        <div className="w-4 h-4 rounded-full bg-primary animate-glow-bounce delay-0"></div>
        <div className="w-4 h-4 rounded-full bg-accent animate-glow-bounce delay-150"></div>
        <div className="w-4 h-4 rounded-full bg-secondary animate-glow-bounce delay-300"></div>
      </div>
    </div>
  );
};
