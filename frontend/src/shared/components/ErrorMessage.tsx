import React from 'react';

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-red-500">Error: {message}</div>
  </div>
);

export default ErrorMessage; 