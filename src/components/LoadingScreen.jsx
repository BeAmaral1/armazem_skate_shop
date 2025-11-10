import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-dark-900 border-t-transparent mb-4"></div>
        <p className="text-gray-600 font-medium text-lg">Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
