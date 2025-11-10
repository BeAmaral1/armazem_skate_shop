import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  RotateCw,
  Play,
  Pause,
  X,
  Grip,
} from 'lucide-react';

const Image360Viewer = ({ images = [], productName = 'Produto' }) => {
  // Se não houver imagens 360, usar imagens normais do produto
  const frames = images.length > 0 ? images : [];
  const totalFrames = frames.length;

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Autoplay
  useEffect(() => {
    if (!isAutoplay || totalFrames === 0) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, 100); // 10 FPS

    return () => clearInterval(interval);
  }, [isAutoplay, totalFrames]);

  // Handle mouse drag
  const handleMouseDown = (e) => {
    if (totalFrames === 0) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setIsAutoplay(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || totalFrames === 0) return;

    const deltaX = e.clientX - startX;
    const sensitivity = 5; // Pixels needed to change frame

    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentFrame((prev) => {
        let newFrame = prev + direction;
        if (newFrame < 0) newFrame = totalFrames - 1;
        if (newFrame >= totalFrames) newFrame = 0;
        return newFrame;
      });
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    if (totalFrames === 0) return;
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setIsAutoplay(false);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || totalFrames === 0) return;

    const deltaX = e.touches[0].clientX - startX;
    const sensitivity = 5;

    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentFrame((prev) => {
        let newFrame = prev + direction;
        if (newFrame < 0) newFrame = totalFrames - 1;
        if (newFrame >= totalFrames) newFrame = 0;
        return newFrame;
      });
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 1));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Rotate manually
  const rotateLeft = () => {
    if (totalFrames === 0) return;
    setCurrentFrame((prev) => (prev - 1 + totalFrames) % totalFrames);
    setIsAutoplay(false);
  };

  const rotateRight = () => {
    if (totalFrames === 0) return;
    setCurrentFrame((prev) => (prev + 1) % totalFrames);
    setIsAutoplay(false);
  };

  // Toggle autoplay
  const toggleAutoplay = () => {
    setIsAutoplay(!isAutoplay);
  };

  // Calculate rotation angle
  const angle = totalFrames > 0 ? Math.round((currentFrame / totalFrames) * 360) : 0;

  // Get current image
  const currentImage = totalFrames > 0 ? frames[currentFrame] : null;

  return (
    <>
      {/* Main Viewer */}
      <div
        ref={containerRef}
        className={`relative bg-gray-100 rounded-xl overflow-hidden ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'aspect-square'
        }`}
      >
        {/* Image */}
        <div
          className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {currentImage ? (
            <img
              ref={imageRef}
              src={currentImage}
              alt={`${productName} - Vista 360° (${angle}°)`}
              className="max-w-full max-h-full object-contain select-none transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
              draggable={false}
            />
          ) : (
            <div className="text-center p-8">
              <RotateCw className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                Visualização 360° não disponível
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Adicione imagens para ativar esta função
              </p>
            </div>
          )}
        </div>

        {/* Drag Hint */}
        {!isDragging && totalFrames > 0 && zoom === 1 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 text-white px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse">
              <Grip className="w-5 h-5" />
              <span className="text-sm font-medium">
                Arraste para girar
              </span>
            </div>
          </div>
        )}

        {/* Angle Indicator */}
        {totalFrames > 0 && (
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
            {angle}°
          </div>
        )}

        {/* Frame Counter */}
        {totalFrames > 0 && (
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
            {currentFrame + 1} / {totalFrames}
          </div>
        )}

        {/* Controls Bar */}
        {totalFrames > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-xl p-2 flex items-center gap-2">
            {/* Rotate Left */}
            <button
              onClick={rotateLeft}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Girar para esquerda"
            >
              <RotateCw className="w-5 h-5 text-white transform scale-x-[-1]" />
            </button>

            {/* Autoplay */}
            <button
              onClick={toggleAutoplay}
              className={`p-2 rounded-lg transition-colors ${
                isAutoplay ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-white/20'
              }`}
              title={isAutoplay ? 'Pausar' : 'Auto-girar'}
            >
              {isAutoplay ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Rotate Right */}
            <button
              onClick={rotateRight}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Girar para direita"
            >
              <RotateCw className="w-5 h-5 text-white" />
            </button>

            <div className="w-px h-6 bg-white/30 mx-1" />

            {/* Zoom Out */}
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Diminuir zoom"
            >
              <ZoomOut className="w-5 h-5 text-white" />
            </button>

            {/* Zoom Reset */}
            {zoom !== 1 && (
              <button
                onClick={handleResetZoom}
                className="px-3 py-1 hover:bg-white/20 rounded-lg transition-colors text-white text-sm font-medium"
                title="Resetar zoom"
              >
                {Math.round(zoom * 100)}%
              </button>
            )}

            {/* Zoom In */}
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-5 h-5 text-white" />
            </button>

            <div className="w-px h-6 bg-white/30 mx-1" />

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title={isFullscreen ? 'Sair do fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5 text-white" />
              ) : (
                <Maximize className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        )}

        {/* Close Fullscreen */}
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-black/90 rounded-lg transition-colors z-10"
            title="Fechar"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Info */}
      {totalFrames > 0 && !isFullscreen && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Dica:</span> Arraste a imagem para girar 360° •
            Use os controles para zoom e rotação automática
          </p>
        </div>
      )}
    </>
  );
};

export default Image360Viewer;
