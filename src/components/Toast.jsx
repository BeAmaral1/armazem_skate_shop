import React, { useEffect } from 'react';
import { CheckCircle, X, Waves, Zap } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6" />;
      case 'surf':
        return <Waves className="w-6 h-6" />;
      case 'skate':
        return <Zap className="w-6 h-6" />;
      default:
        return <CheckCircle className="w-6 h-6" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-dark-600 to-dark-900 text-white';
      case 'surf':
        return 'bg-gradient-to-r from-dark-700 to-dark-950 text-white';
      case 'skate':
        return 'bg-gradient-to-r from-dark-600 to-dark-900 text-white';
      default:
        return 'bg-gradient-to-r from-dark-600 to-dark-900 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-in-right">
      <div
        className={`${getColors()} rounded-xl shadow-2xl p-4 pr-12 min-w-[320px] max-w-md backdrop-blur-sm`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-base leading-tight">
              {message.title}
            </p>
            {message.description && (
              <p className="text-sm mt-1 opacity-90">
                {message.description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-xl overflow-hidden">
          <div
            className="h-full bg-white/40 animate-progress"
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Toast;
