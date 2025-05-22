import { useRef, useState } from 'react';
import { FaTimes, FaUpload, FaEdit, FaImage, FaUserAlt } from 'react-icons/fa';
import { ImageCropper } from './ImageCropper';

export const ProfilePictureModal = ({
  isOpen,
  onClose,
  currentImage,
  onImageUpdate,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropData, setCropData] = useState({
    x: 100,
    y: 100,
    size: 200,
    scale: 1,
    rotate: 0,
  });
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setShowCropper(true);
        setCropData({
          x: 100,
          y: 100,
          size: 200,
          scale: 1,
          rotate: 0,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditCurrent = () => {
    if (currentImage) {
      setSelectedImage(currentImage);
      setShowCropper(true);
      setCropData({
        x: 100,
        y: 100,
        size: 200,
        scale: 1,
        rotate: 0,
      });
    }
  };

  const handleCropApply = (croppedImageData) => {
    onImageUpdate(croppedImageData);
    onClose();
    resetModal();
  };

  const handleCancel = () => {
    setShowCropper(false);
    setSelectedImage(null);
    setCropData({
      x: 100,
      y: 100,
      size: 200,
      scale: 1,
      rotate: 0,
    });
  };

  const resetModal = () => {
    setSelectedImage(null);
    setShowCropper(false);
    setCropData({
      x: 100,
      y: 100,
      size: 200,
      scale: 1,
      rotate: 0,
    });
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  const handleChooseDifferent = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Update Profile Picture</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {!showCropper ? (
          <div className="text-center">
            {/* Current Image Display */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 p-1 shadow-xl mx-auto mb-6 flex items-center justify-center">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt="Current Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FaUserAlt className="w-16 h-16 text-white" />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              {/* Edit Current Image Button */}
              {currentImage && (
                <button
                  onClick={handleEditCurrent}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-6 py-3 rounded-xl flex items-center transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <FaEdit className="w-4 h-4 mr-2" />
                  Edit Current Image
                </button>
              )}

              {/* Choose New Image Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6 py-3 rounded-xl flex items-center transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <FaUpload className="w-4 h-4 mr-2" />
                Choose New Picture
              </button>
            </div>

            {/* Helper Text */}
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">
                {currentImage ? 'Edit your current image or upload a new one' : 'Upload a new profile picture'}
              </p>
              <p className="text-gray-500 text-xs">
                Supported formats: JPG, PNG, GIF (max. 5MB)
              </p>
            </div>

            {/* Additional Info */}
            {currentImage && (
              <div className="mt-6 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 text-cyan-300 text-sm">
                  <FaImage className="w-4 h-4" />
                  <span>Current image can be cropped and adjusted</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <ImageCropper
            selectedImage={selectedImage}
            cropData={cropData}
            onCropChange={setCropData}
            onCropApply={handleCropApply}
            onCancel={handleCancel}
            onChooseDifferent={handleChooseDifferent}
          />
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
};