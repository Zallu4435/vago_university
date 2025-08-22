import { useState, useRef } from 'react';
import { FaTimes, FaUpload, FaCheck, FaSearchPlus, FaSearchMinus, FaUndo, FaRedo } from 'react-icons/fa';
import { ImageCropperProps } from '../../../../domain/types/settings/user';

export const ImageCropper = ({
  selectedImage,
  cropData,
  onCropChange,
  onCropApply,
  onCancel,
  onChooseDifferent,
}: ImageCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const getCroppedImage = () => {
    if (!selectedImage || !canvasRef.current || !imageRef.current || imageLoadError) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    if (!ctx) return null;

    const outputSize = 200;
    canvas.width = outputSize;
    canvas.height = outputSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const containerSize = 300;

    const imgDisplayWidth = containerSize * cropData.scale;
    const imgDisplayHeight = containerSize * cropData.scale;

    const scaleX = img.naturalWidth / imgDisplayWidth;
    const scaleY = img.naturalHeight / imgDisplayHeight;

    const cropX = cropData.x * scaleX;
    const cropY = cropData.y * scaleY;
    const cropSize = cropData.size * Math.min(scaleX, scaleY);

    ctx.save();

    if (cropData.rotate !== 0) {
      ctx.translate(outputSize / 2, outputSize / 2);
      ctx.rotate((cropData.rotate * Math.PI) / 180);
      ctx.translate(-outputSize / 2, -outputSize / 2);
    }

    ctx.drawImage(
      img,
      cropX,
      cropY,
      cropSize,
      cropSize,
      0,
      0,
      outputSize,
      outputSize
    );

    ctx.restore();

    return canvas;
  };

  const handleApply = () => {
    if (imageLoadError) {
      alert('Cannot process the image due to cross-origin restrictions. Please upload a new image.');
      return;
    }

    const canvas = getCroppedImage();
    if (canvas) {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const timestamp = Date.now();
            const file = new File([blob], `profile-picture-${timestamp}.jpg`, { 
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            onCropApply(file);
          }
        },
        'image/jpeg',
        0.95 
      );
    }
  };

  const handleImageLoad = () => {
    setImageLoadError(false);
  };

  const handleImageError = () => {
    console.error('Failed to load image due to CORS or other issues:', selectedImage);
    setImageLoadError(true);
  };

  const handleZoomIn = () => {
    onCropChange({
      ...cropData,
      scale: Math.min(cropData.scale + 0.1, 3),
    });
  };

  const handleZoomOut = () => {
    onCropChange({
      ...cropData,
      scale: Math.max(cropData.scale - 0.1, 0.5),
    });
  };

  const handleRotate = () => {
    onCropChange({
      ...cropData,
      rotate: (cropData.rotate + 90) % 360,
    });
  };

  const handleReset = () => {
    onCropChange({
      x: 75,
      y: 75,
      size: 150,
      scale: 1,
      rotate: 0,
    });
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'resize') => {
    e.preventDefault();
    const targetElement = e.currentTarget;
    const containerElement = targetElement.closest('.crop-container');
    if (!containerElement) return;

    const containerRect = containerElement.getBoundingClientRect();

    if (type === 'move') {
      setIsDragging(true);
      const startX = e.clientX - containerRect.left - cropData.x;
      const startY = e.clientY - containerRect.top - cropData.y;

      const handleMouseMove = (e: MouseEvent) => {
        const newX = e.clientX - containerRect.left - startX;
        const newY = e.clientY - containerRect.top - startY;

        const maxX = 300 - cropData.size;
        const maxY = 300 - cropData.size;

        onCropChange({
          ...cropData,
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else if (type === 'resize') {
      setIsResizing(true);
      const startSize = cropData.size;
      const startX = e.clientX;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX;
        const newSize = Math.max(80, Math.min(startSize + deltaX, 280));

        const maxX = 300 - newSize;
        const maxY = 300 - newSize;

        onCropChange({
          ...cropData,
          size: newSize,
          x: Math.max(0, Math.min(cropData.x, maxX)),
          y: Math.max(0, Math.min(cropData.y, maxY)),
        });
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const getPreviewStyle = (size: number) => {
    const scale = size / cropData.size;
    return {
      backgroundImage: `url(${selectedImage})`,
      backgroundSize: `${300 * cropData.scale * scale}px ${300 * cropData.scale * scale}px`,
      backgroundPosition: `-${cropData.x * scale * cropData.scale}px -${cropData.y * scale * cropData.scale
        }px`,
      backgroundRepeat: 'no-repeat',
      transform: `rotate(${cropData.rotate}deg)`,
      transformOrigin: 'center',
    };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {imageLoadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 text-sm font-medium">Unable to load the image</p>
          <p className="text-red-500 text-xs mt-1">Please upload a new image to continue.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Cropper */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Crop Your Image</h3>
            <div
              className="crop-container relative mx-auto border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50"
              style={{ width: '300px', height: '300px' }}
            >
              <img
                ref={imageRef}
                src={selectedImage}
                alt="Crop preview"
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${cropData.scale}) rotate(${cropData.rotate}deg)`,
                  transformOrigin: 'center',
                }}
                crossOrigin="anonymous"
                onLoad={handleImageLoad}
                onError={handleImageError}
                draggable={false}
              />

              <div
                className="absolute border-3 border-blue-500 rounded-full shadow-xl cursor-move select-none"
                style={{
                  left: `${cropData.x}px`,
                  top: `${cropData.y}px`,
                  width: `${cropData.size}px`,
                  height: `${cropData.size}px`,
                  pointerEvents: isDragging || isResizing ? 'none' : 'auto',
                }}
                onMouseDown={(e) => handleMouseDown(e, 'move')}
              >
                <div className="absolute inset-0 bg-blue-500/20 rounded-full"></div>
                <div className="absolute inset-1 border-2 border-blue-400/60 rounded-full border-dashed"></div>

                <div
                  className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-se-resize hover:bg-blue-600 transition-colors hover:scale-110"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, 'resize');
                  }}
                />
              </div>

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${cropData.x + cropData.size / 2
                    }px ${cropData.y + cropData.size / 2}px, transparent ${cropData.size / 2
                    }px, rgba(0,0,0,0.5) ${cropData.size / 2 + 1}px)`,
                }}
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Drag to move</span> • <span className="font-medium">Drag corner to resize</span>
              </p>
              <p className="text-gray-500 text-xs mt-1">Scale: {cropData.scale.toFixed(1)}x • Rotation: {cropData.rotate}°</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h4 className="text-lg font-semibold text-gray-800 text-center mb-4">Preview</h4>

            <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-gray-200 shadow-md mx-auto mb-6 overflow-hidden">
              <div className="w-full h-full" style={getPreviewStyle(128)} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm font-medium">Large (128px)</span>
                <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                  <div className="w-full h-full" style={getPreviewStyle(64)} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm font-medium">Medium (64px)</span>
                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                  <div className="w-full h-full" style={getPreviewStyle(40)} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm font-medium">Small (32px)</span>
                <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                  <div className="w-full h-full" style={getPreviewStyle(24)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <FaUndo className="w-3 h-3 mr-2" />
            Reset
          </button>
          <button
            onClick={handleZoomIn}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <FaSearchPlus className="w-3 h-3 mr-2" />
            Zoom In
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <FaSearchMinus className="w-3 h-3 mr-2" />
            Zoom Out
          </button>
          <button
            onClick={handleRotate}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <FaRedo className="w-3 h-3 mr-2" />
            Rotate 90°
          </button>
        </div>
      </div>

      <div className="flex gap-4 justify-center pt-2">
        <button
          onClick={handleApply}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg flex items-center text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          disabled={imageLoadError}
        >
          <FaCheck className="w-4 h-4 mr-2" />
          Apply & Save
        </button>
        <button
          onClick={onCancel}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg flex items-center text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <FaTimes className="w-4 h-4 mr-2" />
          Cancel
        </button>
        <button
          onClick={onChooseDifferent}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg flex items-center text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <FaUpload className="w-4 h-4 mr-2" />
          Choose Different
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;