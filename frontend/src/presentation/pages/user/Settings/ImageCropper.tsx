import { useState, useRef } from 'react';
import { FaTimes, FaCrop, FaUpload, FaCheck } from 'react-icons/fa';

// Image Cropper Component
export const ImageCropper = ({
  selectedImage,
  cropData,
  onCropChange,
  onCropApply,
  onCancel,
  onChooseDifferent,
}) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const getCroppedImage = () => {
    if (!selectedImage || !canvasRef.current || !imageRef.current || imageLoadError) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    // Set canvas size for square crop
    const outputSize = 300;
    canvas.width = outputSize;
    canvas.height = outputSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate the source coordinates on the original image
    const containerSize = 400;
    const scaleRatio = img.naturalWidth / containerSize;

    const sourceX = (cropData.x * scaleRatio) / cropData.scale;
    const sourceY = (cropData.y * scaleRatio) / cropData.scale;
    const sourceSize = (cropData.size * scaleRatio) / cropData.scale;

    // Save context state
    ctx.save();

    // Apply rotation around center
    ctx.translate(outputSize / 2, outputSize / 2);
    ctx.rotate((cropData.rotate * Math.PI) / 180);

    // Draw the cropped portion
    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      -outputSize / 2,
      -outputSize / 2,
      outputSize,
      outputSize
    );

    // Restore context state
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
            const file = new File([blob], 'profile-picture.jpg', { type: 'image/jpeg' });
            console.log('Cropped file created:', { name: file.name, size: file.size, type: file.type });
            onCropApply(file);
          }
        },
        'image/jpeg',
        0.9
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
      x: 100,
      y: 100,
      size: 200,
      scale: 1,
      rotate: 0,
    });
  };

  const handleMouseDown = (e, type) => {
    e.preventDefault();
    const targetElement = e.currentTarget;
    const containerElement = targetElement.closest('.crop-container');
    if (!containerElement) return;

    const containerRect = containerElement.getBoundingClientRect();

    if (type === 'move') {
      setIsDragging(true);
      const startX = e.clientX - containerRect.left - cropData.x;
      const startY = e.clientY - containerRect.top - cropData.y;

      const handleMouseMove = (e) => {
        const newX = e.clientX - containerRect.left - startX;
        const newY = e.clientY - containerRect.top - startY;

        const maxX = 400 - cropData.size;
        const maxY = 400 - cropData.size;

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

      const handleMouseMove = (e) => {
        const deltaX = e.clientX - startX;
        const newSize = Math.max(80, Math.min(startSize + deltaX, 300));

        // Adjust position if crop area goes out of bounds
        const maxX = 400 - newSize;
        const maxY = 400 - newSize;

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

  const getPreviewStyle = (size) => {
    const scale = size / cropData.size;
    return {
      backgroundImage: `url(${selectedImage})`,
      backgroundSize: `${400 * cropData.scale * scale}px ${400 * cropData.scale * scale}px`,
      backgroundPosition: `-${cropData.x * scale * cropData.scale}px -${
        cropData.y * scale * cropData.scale
      }px`,
      backgroundRepeat: 'no-repeat',
      transform: `rotate(${cropData.rotate}deg)`,
      transformOrigin: 'center',
    };
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {imageLoadError && (
        <div className="text-red-400 text-center">
          Unable to load the image. Please upload a new image.
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Main Cropper */}
        <div className="flex-1">
          <div className="relative bg-black/30 rounded-2xl p-4 backdrop-blur-sm">
            <div
              className="crop-container relative mx-auto border border-gray-600 rounded-xl overflow-hidden"
              style={{ width: '400px', height: '400px' }}
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

              {/* Crop Overlay */}
              <div
                className="absolute border-2 border-cyan-400 rounded-full shadow-lg cursor-move select-none"
                style={{
                  left: `${cropData.x}px`,
                  top: `${cropData.y}px`,
                  width: `${cropData.size}px`,
                  height: `${cropData.size}px`,
                  pointerEvents: isDragging || isResizing ? 'none' : 'auto',
                }}
                onMouseDown={(e) => handleMouseDown(e, 'move')}
              >
                <div className="absolute inset-0 bg-cyan-400/10 rounded-full"></div>
                <div className="absolute inset-2 border border-cyan-300/50 rounded-full"></div>

                {/* Resize Handle */}
                <div
                  className="absolute -bottom-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full border-2 border-white shadow-lg cursor-se-resize"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, 'resize');
                  }}
                />
              </div>

              {/* Dark overlay outside crop area */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${
                    cropData.x + cropData.size / 2
                  }px ${cropData.y + cropData.size / 2}px, transparent ${
                    cropData.size / 2
                  }px, rgba(0,0,0,0.5) ${cropData.size / 2 + 1}px)`,
                }}
              />
            </div>
            <p className="text-cyan-300 text-sm text-center mt-4">
              Drag to move • Drag corner to resize • Scale: {cropData.scale.toFixed(1)}x
            </p>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col items-center min-w-40">
          <p className="text-cyan-300 text-sm mb-4 font-medium">Preview</p>

          {/* Large Preview */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 p-1 shadow-xl mb-4">
            <div className="w-full h-full rounded-full overflow-hidden" style={getPreviewStyle(128)} />
          </div>

          {/* Size Previews */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 p-0.5">
                <div
                  className="w-full h-full rounded-full overflow-hidden"
                  style={getPreviewStyle(48)}
                />
              </div>
              <span className="text-gray-300 text-xs">Medium (48px)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 p-0.5">
                <div
                  className="w-full h-full rounded-full overflow-hidden"
                  style={getPreviewStyle(32)}
                />
              </div>
              <span className="text-gray-300 text-xs">Small (32px)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleReset}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 text-sm"
          >
            <FaCrop className="w-3 h-3 mr-2" />
            Reset
          </button>
          <button
            onClick={handleZoomIn}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm"
          >
            Zoom In
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm"
          >
            Zoom Out
          </button>
          <button
            onClick={handleRotate}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm"
          >
            Rotate 90°
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center pt-4">
        <button
          onClick={handleApply}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-8 py-3 rounded-xl flex items-center font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          disabled={imageLoadError}
        >
          <FaCheck className="w-4 h-4 mr-2" />
          Apply & Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white px-8 py-3 rounded-xl flex items-center font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <FaTimes className="w-4 h-4 mr-2" />
          Cancel
        </button>
        <button
          onClick={onChooseDifferent}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-8 py-3 rounded-xl flex items-center font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <FaUpload className="w-4 h-4 mr-2" />
          Choose Different
        </button>
      </div>
    </div>
  );
};