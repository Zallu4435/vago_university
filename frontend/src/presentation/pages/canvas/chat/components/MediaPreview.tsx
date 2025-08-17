import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiRotateCcw, FiEdit3, FiType, FiSquare, FiSmile, FiDownload, FiPlus } from 'react-icons/fi';

interface Attachment {
  url: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
}

interface Message {
  attachments?: Attachment[];
}

interface MediaPreviewProps {
  message: Message;
  onClose: () => void;
  styles?: unknown;
  onAddMore?: () => void;
  onRemoveMedia?: (index: number) => void;
  onSendMedia?: (media: { url: string; name: string; type: string; caption: string }[]) => void;
}

type Tool = 'none' | 'rotate' | 'draw' | 'text' | 'rect' | 'blur' | 'emoji' | 'crop';

interface TextElement {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
  background: string;
  isEditing: boolean;
}

interface RectElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  thickness: number;
  fill: boolean;
}

interface BlurArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EmojiElement {
  id: string;
  x: number;
  y: number;
  emoji: string;
  size: number;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ message, onClose, onAddMore, onRemoveMedia, onSendMedia }) => {
  const [caption, setCaption] = useState('');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [captions, setCaptions] = useState<string[]>(() => (message.attachments || []).map(() => ''));
  const [rotation, setRotation] = useState<number[]>(() => (message.attachments || []).map(() => 0));
  const [currentTool, setCurrentTool] = useState<Tool>('none');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawPaths, setDrawPaths] = useState<{[key: number]: Array<unknown>}>({});
  const [textElements, setTextElements] = useState<{[key: number]: TextElement[]}>({});
  const [rectElements, setRectElements] = useState<{[key: number]: RectElement[]}>({});
  const [blurAreas, setBlurAreas] = useState<{[key: number]: BlurArea[]}>({});
  const [emojiElements, setEmojiElements] = useState<{[key: number]: EmojiElement[]}>({});
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const drawingPath = useRef<{x: number, y: number}[]>([]);
  const currentElement = useRef<unknown>(null);

  const penColors = ['#ff0000', '#00bcd4', '#4caf50', '#ffeb3b', '#ffffff', '#000000'];
  const penThicknesses = [2, 4, 8, 12];
  const [penColor, setPenColor] = useState<string>('#ff0000');
  const [penThickness, setPenThickness] = useState<number>(2);
  const [isEraser, setIsEraser] = useState(false);
  
  const [textColor, setTextColor] = useState('#ffffff');
  const [textBackground, setTextBackground] = useState('transparent');
  const [fontSize, setFontSize] = useState(24);
  
  const [rectFill, setRectFill] = useState(false);
  
  const commonEmojis = ['😀', '😂', '😍', '🤔', '😢', '😡', '👍', '👎', '❤️', '🔥', '💯', '🎉'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    // Prevent background scrolling
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = originalStyle;
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [onClose]);

  // Mock data for demonstration
  const mockMessage: Message = {
    attachments: [
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
        name: 'cyborg-woman.jpg',
        type: 'image'
      }
    ]
  };

  const currentMessage = message.attachments?.length ? message : mockMessage;
  
  if (!currentMessage.attachments?.length) return null;

  const attachments = currentMessage.attachments;
  if (!attachments.length || currentMediaIndex < 0 || currentMediaIndex >= attachments.length) return null;
  const attachment = attachments[currentMediaIndex];
  const isImage = attachment.type === 'image';

  useEffect(() => {
    setCaption(captions[currentMediaIndex] || '');
  }, [currentMediaIndex]);

  useEffect(() => {
    if (currentMediaIndex >= attachments.length) {
      setCurrentMediaIndex(Math.max(attachments.length - 1, 0));
    }
  }, [attachments.length]);

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCaption(value);
    setCaptions((prev) => {
      const updated = [...prev];
      updated[currentMediaIndex] = value;
      return updated;
    });
  };

  const handleSend = () => {
    if (onSendMedia) {
      onSendMedia(attachments.map((att, idx) => ({ ...att, caption: captions[idx] || '' })));
    } else {
      console.log('Sending media with captions:', captions);
    }
  };

  const handlePrev = () => {
    setCurrentMediaIndex((prev) => (prev === 0 ? attachments.length - 1 : prev - 1));
    setCurrentTool('none');
  };
  
  const handleNext = () => {
    setCurrentMediaIndex((prev) => (prev === attachments.length - 1 ? 0 : prev + 1));
    setCurrentTool('none');
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    
    switch (currentTool) {
      case 'draw':
        setIsDrawing(true);
        drawingPath.current = [coords];
        break;
        
      case 'text':
        const textId = Date.now().toString();
        const newTextElement: TextElement = {
          id: textId,
          x: coords.x,
          y: coords.y,
          text: '',
          color: textColor,
          fontSize: fontSize,
          background: textBackground,
          isEditing: true
        };
        setTextElements(prev => ({
          ...prev,
          [currentMediaIndex]: [...(prev[currentMediaIndex] || []), newTextElement]
        }));
        break;
        
      case 'rect':
        setIsDrawing(true);
        currentElement.current = {
          id: Date.now().toString(),
          x: coords.x,
          y: coords.y,
          width: 0,
          height: 0,
          color: penColor,
          thickness: penThickness,
          fill: rectFill
        };
        break;
        
      case 'blur':
        setIsDrawing(true);
        currentElement.current = {
          id: Date.now().toString(),
          x: coords.x,
          y: coords.y,
          width: 0,
          height: 0
        };
        break;
        
      case 'emoji':
        setShowEmojiPicker(true);
        currentElement.current = coords;
        break;
        
      case 'crop':
        setIsDrawing(true);
        setCropArea({
          x: coords.x,
          y: coords.y,
          width: 0,
          height: 0
        });
        break;
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCanvasCoordinates(e);
    
    switch (currentTool) {
      case 'draw':
        drawingPath.current.push(coords);
        drawOnCanvas();
        break;
        
      case 'rect':
        if (currentElement.current) {
          const rect = currentElement.current as RectElement;
          rect.width = coords.x - rect.x;
          rect.height = coords.y - rect.y;
          drawOnCanvas();
        }
        break;
        
      case 'blur':
        if (currentElement.current) {
          const blur = currentElement.current as BlurArea;
          blur.width = coords.x - blur.x;
          blur.height = coords.y - blur.y;
          drawOnCanvas();
        }
        break;
        
      case 'crop':
        if (cropArea) {
          setCropArea({
            ...cropArea,
            width: coords.x - cropArea.x,
            height: coords.y - cropArea.y
          });
        }
        break;
    }
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    switch (currentTool) {
      case 'draw':
        setDrawPaths(prev => {
          const paths = {...prev};
          if (!paths[currentMediaIndex]) paths[currentMediaIndex] = [];
          paths[currentMediaIndex].push({
            type: 'path',
            points: [...drawingPath.current],
            color: isEraser ? 'eraser' : penColor,
            thickness: penThickness
          });
          return paths;
        });
        drawingPath.current = [];
        break;
        
      case 'rect':
        if (currentElement.current) {
          const rect = currentElement.current as RectElement;
          if (Math.abs(rect.width) > 10 || Math.abs(rect.height) > 10) {
            setRectElements(prev => ({
              ...prev,
              [currentMediaIndex]: [...(prev[currentMediaIndex] || []), rect]
            }));
          }
        }
        currentElement.current = null;
        break;
        
      case 'blur':
        if (currentElement.current) {
          const blur = currentElement.current as BlurArea;
          if (Math.abs(blur.width) > 10 || Math.abs(blur.height) > 10) {
            setBlurAreas(prev => ({
              ...prev,
              [currentMediaIndex]: [...(prev[currentMediaIndex] || []), blur]
            }));
          }
        }
        currentElement.current = null;
        break;
    }
  };

  const drawOnCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw blur areas (pixelated effect)
    (blurAreas[currentMediaIndex] || []).forEach(area => {
      if (!area) return;
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(area.x, area.y, area.width, area.height);
      
      const mosaicSize = 8;
      for (let x = area.x; x < area.x + area.width; x += mosaicSize) {
        for (let y = area.y; y < area.y + area.height; y += mosaicSize) {
          ctx.fillStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.5)`;
          ctx.fillRect(x, y, mosaicSize, mosaicSize);
        }
      }
      ctx.restore();
    });
    
    if (currentElement.current && currentTool === 'blur') {
      const blur = currentElement.current as BlurArea;
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(blur.x, blur.y, blur.width, blur.height);
      ctx.restore();
    }
    
    (rectElements[currentMediaIndex] || []).forEach(rect => {
      if (!rect) return;
      ctx.save();
      ctx.strokeStyle = rect.color;
      ctx.lineWidth = rect.thickness;
      if (rect.fill) {
        ctx.fillStyle = rect.color + '40'; 
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      }
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
      ctx.restore();
    });
    
    if (currentElement.current && currentTool === 'rect') {
      const rect = currentElement.current as RectElement;
      ctx.save();
      ctx.strokeStyle = rect.color;
      ctx.lineWidth = rect.thickness;
      if (rect.fill) {
        ctx.fillStyle = rect.color + '40';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      }
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
      ctx.restore();
    }
    
    (drawPaths[currentMediaIndex] || []).forEach((pathObj) => {
      const { points, color, thickness } = pathObj as { points: { x: number; y: number }[]; color: string; thickness: number };
      ctx.save();
      if (color === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = '#fff';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
      }
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      (points as {x: number, y: number}[]).forEach((point: {x: number, y: number}, i: number) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
      ctx.restore();
    });
    
    if (drawingPath.current.length > 0) {
      ctx.save();
      if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = '#fff';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = penColor;
      }
      ctx.lineWidth = penThickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      drawingPath.current.forEach((point: {x: number, y: number}, i: number) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
      ctx.restore();
    }
  }, [currentTool, currentMediaIndex, drawPaths, blurAreas, rectElements, penColor, penThickness, isEraser]);

  useEffect(() => {
    if (isImage && canvasRef.current) {
      drawOnCanvas();
    }
  }, [drawOnCanvas, isImage]);

  const handleEmojiSelect = (emoji: string) => {
    if (currentElement.current) {
      const coords = currentElement.current as { x: number; y: number };
      const newEmoji: EmojiElement = {
        id: Date.now().toString(),
        x: coords.x,
        y: coords.y,
        emoji: emoji,
        size: 32
      };
      setEmojiElements(prev => ({
        ...prev,
        [currentMediaIndex]: [...(prev[currentMediaIndex] || []), newEmoji]
      }));
    }
    setShowEmojiPicker(false);
    currentElement.current = null;
  };

  const handleTextEdit = (id: string, newText: string) => {
    setTextElements(prev => ({
      ...prev,
      [currentMediaIndex]: (prev[currentMediaIndex] || []).map(el => 
        el.id === id ? { ...el, text: newText, isEditing: false } : el
      )
    }));
  };

  const applyCrop = () => {
    if (cropArea && imageRef.current) {
      console.log('Cropping image with area:', cropArea);
    }
    setCropArea(null);
    setCurrentTool('none');
  };

  const handleRotate = () => {
    if (!isImage) return;
    setRotation(prev => {
      const updated = [...prev];
      updated[currentMediaIndex] = ((updated[currentMediaIndex] || 0) + 90) % 360;
      return updated;
    });
    setCurrentTool('none');
  };

  const renderToolPalette = () => {
    if (currentTool === 'none' || !isImage) return null;

    const paletteClass = "absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 bg-black/80 px-4 py-2 rounded-full shadow-lg";

    switch (currentTool) {
      case 'draw':
        return (
          <div className={paletteClass}>
            {penColors.map(color => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border-2 ${penColor === color && !isEraser ? 'border-white' : 'border-gray-400'}`}
                style={{ backgroundColor: color }}
                onClick={e => { e.stopPropagation(); setPenColor(color); setIsEraser(false); }}
              />
            ))}
            {penThicknesses.map(thick => (
              <button
                key={thick}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-gray-200 ${penThickness === thick && !isEraser ? 'border-blue-500' : 'border-gray-400'}`}
                onClick={e => { e.stopPropagation(); setPenThickness(thick); setIsEraser(false); }}
              >
                <div style={{ width: thick, height: thick, background: penColor, borderRadius: '50%' }} />
              </button>
            ))}
            <button
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white ${isEraser ? 'border-red-500' : 'border-gray-400'}`}
              onClick={e => { e.stopPropagation(); setIsEraser(true); }}
              title="Eraser"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 13.5V19a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 015 19v-5.5M16 3.5a2.121 2.121 0 013 3L7.5 18.5a2.121 2.121 0 01-3-3L16 3.5z" />
              </svg>
            </button>
          </div>
        );

      case 'text':
        return (
          <div className={paletteClass}>
            {penColors.map(color => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border-2 ${textColor === color ? 'border-white' : 'border-gray-400'}`}
                style={{ backgroundColor: color }}
                onClick={e => { e.stopPropagation(); setTextColor(color); }}
              />
            ))}
            <div className="w-px h-6 bg-gray-500" />
            {[12, 16, 24, 32].map(size => (
              <button
                key={size}
                className={`px-2 py-1 rounded text-white text-xs ${fontSize === size ? 'bg-blue-500' : 'bg-gray-600'}`}
                onClick={e => { e.stopPropagation(); setFontSize(size); }}
              >
                {size}
              </button>
            ))}
            <button
              className={`px-2 py-1 rounded text-white text-xs ${textBackground !== 'transparent' ? 'bg-blue-500' : 'bg-gray-600'}`}
              onClick={e => { e.stopPropagation(); setTextBackground(textBackground === 'transparent' ? 'rgba(0,0,0,0.5)' : 'transparent'); }}
            >
              BG
            </button>
          </div>
        );

      case 'rect':
        return (
          <div className={paletteClass}>
            {penColors.map(color => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border-2 ${penColor === color ? 'border-white' : 'border-gray-400'}`}
                style={{ backgroundColor: color }}
                onClick={e => { e.stopPropagation(); setPenColor(color); }}
              />
            ))}
            {penThicknesses.map(thick => (
              <button
                key={thick}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-gray-200 ${penThickness === thick ? 'border-blue-500' : 'border-gray-400'}`}
                onClick={e => { e.stopPropagation(); setPenThickness(thick); }}
              >
                <div style={{ width: thick/2, height: thick/2, background: penColor, borderRadius: '50%' }} />
              </button>
            ))}
            <button
              className={`px-2 py-1 rounded text-white text-xs ${rectFill ? 'bg-blue-500' : 'bg-gray-600'}`}
              onClick={e => { e.stopPropagation(); setRectFill(!rectFill); }}
            >
              Fill
            </button>
          </div>
        );

      case 'crop':
        return (
          <div className={paletteClass}>
            <button
              className="px-3 py-1 bg-green-500 text-white rounded text-sm"
              onClick={applyCrop}
            >
              Apply Crop
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
              onClick={() => { setCropArea(null); setCurrentTool('none'); }}
            >
              Cancel
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
      <div ref={modalRef} className="w-full max-w-4xl h-[80vh] md:h-[80vh] mx-auto bg-black rounded-lg shadow-lg flex flex-col overflow-hidden relative">
        {/* Main close button at top-left */}
        <button
          onClick={onClose}
          className="absolute top-2 md:top-4 left-2 md:left-4 z-50 bg-white/90 hover:bg-white text-black rounded-full p-1.5 md:p-2 shadow-lg transition-colors flex items-center justify-center"
          style={{ fontSize: 28, lineHeight: 1 }}
          title="Close"
        >
          <FiX className="w-4 h-4 md:w-6 md:h-6" />
        </button>

        {/* Top toolbar */}
        <div className="flex items-center justify-between px-2 md:px-3 py-1 md:py-2 bg-gray-900">
          <div />
          <div className="flex items-center space-x-0.5 md:space-x-1">
            {/* Rotate */}
            <button
              className={`text-white p-1.5 md:p-2 rounded ${isImage ? (currentTool === 'rotate' ? 'bg-gray-700' : '') : 'opacity-50 pointer-events-none'}`}
              onClick={handleRotate}
              title="Rotate"
            >
              <FiRotateCcw className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            
            {/* Draw/Pen */}
            <button
              className={`text-white p-1.5 md:p-2 rounded ${isImage ? (currentTool === 'draw' ? 'bg-gray-700' : '') : 'opacity-50 pointer-events-none'}`}
              onClick={() => {
                if (!isImage) return;
                setCurrentTool(currentTool === 'draw' ? 'none' : 'draw');
              }}
              title="Draw/Pen"
            >
              <FiEdit3 className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            
            {/* Text */}
            <button
              className={`text-white p-1.5 md:p-2 rounded ${isImage ? (currentTool === 'text' ? 'bg-gray-700' : '') : 'opacity-50 pointer-events-none'}`}
              onClick={() => {
                if (!isImage) return;
                setCurrentTool(currentTool === 'text' ? 'none' : 'text');
              }}
              title="Add Text"
            >
              <FiType className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            
            {/* Rectangle */}
            <button
              className={`text-white p-1.5 md:p-2 rounded ${isImage ? (currentTool === 'rect' ? 'bg-gray-700' : '') : 'opacity-50 pointer-events-none'}`}
              onClick={() => {
                if (!isImage) return;
                setCurrentTool(currentTool === 'rect' ? 'none' : 'rect');
              }}
              title="Rectangle"
            >
              <FiSquare className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            
            {/* Mosaic/Blur */}
            <button
              className={`text-white p-1.5 md:p-2 rounded ${isImage ? (currentTool === 'blur' ? 'bg-gray-700' : '') : 'opacity-50 pointer-events-none'}`}
              onClick={() => {
                if (!isImage) return;
                setCurrentTool(currentTool === 'blur' ? 'none' : 'blur');
              }}
              title="Blur/Mosaic"
            >
              <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="6" height="6" rx="1"/>
                <rect x="9" y="3" width="6" height="6" rx="1"/>
                <rect x="15" y="3" width="6" height="6" rx="1"/>
                <rect x="3" y="9" width="6" height="6" rx="1"/>
                <rect x="9" y="9" width="6" height="6" rx="1"/>
                <rect x="15" y="9" width="6" height="6" rx="1"/>
                <rect x="3" y="15" width="6" height="6" rx="1"/>
                <rect x="9" y="15" width="6" height="6" rx="1"/>
                <rect x="15" y="15" width="6" height="6" rx="1"/>
              </svg>
            </button>
            
            {/* Emoji */}
            <button
              className={`text-white p-1.5 md:p-2 rounded ${isImage ? (currentTool === 'emoji' ? 'bg-gray-700' : '') : 'opacity-50 pointer-events-none'}`}
              onClick={() => {
                if (!isImage) return;
                setCurrentTool(currentTool === 'emoji' ? 'none' : 'emoji');
              }}
              title="Add Emoji"
            >
              <FiSmile className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            
            {/* Crop */}
            <button
              className={`text-white p-1.5 md:p-2 rounded ${isImage ? (currentTool === 'crop' ? 'bg-gray-700' : '') : 'opacity-50 pointer-events-none'}`}
              onClick={() => {
                if (!isImage) return;
                setCurrentTool(currentTool === 'crop' ? 'none' : 'crop');
              }}
              title="Crop"
            >
              <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2v14a2 2 0 0 0 2 2h14"/>
                <path d="M18 6H8a2 2 0 0 0-2 2v10"/>
              </svg>
            </button>
            
            {/* Quality/HD */}
            <button className="text-white p-1.5 md:p-2" title="HD Quality">
              <div className="border border-white rounded px-1 text-xs font-bold">
                HD
              </div>
            </button>
            
            {/* Download */}
            <button className="text-white p-1.5 md:p-2" title="Download">
              <FiDownload className="w-4 h-4 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Main content area with carousel arrows */}
        <div className="flex-1 flex flex-col items-center justify-center bg-black relative">
          {/* Tool palette just above image */}
          {isImage && currentTool !== 'none' && (
            <div className="mb-2 md:mb-4">{renderToolPalette()}</div>
          )}
          <div className="w-full flex items-center justify-center relative" style={{ minHeight: '200px' }}>
            {attachments.length > 1 && (
              <button onClick={handlePrev} className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-60 hover:bg-opacity-90 text-white rounded-full p-1.5 md:p-2 z-10">
                <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            
            {isImage ? (
              <div className="relative">
                <img
                  ref={imageRef}
                  src={attachment.url}
                  alt={attachment.name}
                  className="w-auto h-auto max-w-[90vw] md:max-w-[95vw] max-h-[60vh] md:max-h-[72vh] object-contain rounded-xl shadow-lg"
                  style={{ 
                    maxHeight: '60vh', 
                    maxWidth: '90vw', 
                    transform: `rotate(${rotation[currentMediaIndex] || 0}deg)` 
                  }}
                />
                
                {/* Canvas overlay for drawing and effects */}
                {(currentTool !== 'none' && currentTool !== 'rotate') && (
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="absolute top-0 left-0 w-full h-full z-20 cursor-crosshair"
                    style={{ 
                      pointerEvents: 'auto',
                      cursor: currentTool === 'draw' ? 'crosshair' : 
                             currentTool === 'text' ? 'text' :
                             currentTool === 'crop' ? 'crosshair' : 'default'
                    }}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                  />
                )}
                
                {/* Text elements overlay */}
                {(textElements[currentMediaIndex] || []).map(textEl => (
                  <div
                    key={textEl.id}
                    className="absolute z-30 cursor-move"
                    style={{
                      left: textEl.x,
                      top: textEl.y,
                      color: textEl.color,
                      fontSize: textEl.fontSize,
                      backgroundColor: textEl.background,
                      padding: textEl.background !== 'transparent' ? '4px 8px' : '0',
                      borderRadius: textEl.background !== 'transparent' ? '4px' : '0',
                      fontWeight: 'bold',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    {textEl.isEditing ? (
                      <input
                        type="text"
                        autoFocus
                        className="bg-transparent border-none outline-none text-white"
                        style={{ 
                          color: textEl.color, 
                          fontSize: textEl.fontSize,
                          fontWeight: 'bold'
                        }}
                        onBlur={(e) => handleTextEdit(textEl.id, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleTextEdit(textEl.id, (e.target as HTMLInputElement).value);
                          }
                        }}
                      />
                    ) : (
                      <div
                        onClick={() => {
                          setTextElements(prev => ({
                            ...prev,
                            [currentMediaIndex]: (prev[currentMediaIndex] || []).map(el => 
                              el.id === textEl.id ? { ...el, isEditing: true } : el
                            )
                          }));
                        }}
                      >
                        {textEl.text || 'Type here...'}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Emoji elements overlay */}
                {(emojiElements[currentMediaIndex] || []).map(emojiEl => (
                  <div
                    key={emojiEl.id}
                    className="absolute z-30 cursor-move select-none"
                    style={{
                      left: emojiEl.x,
                      top: emojiEl.y,
                      fontSize: emojiEl.size,
                      lineHeight: 1
                    }}
                  >
                    {emojiEl.emoji}
                  </div>
                ))}
                
                {/* Crop overlay */}
                {cropArea && currentTool === 'crop' && (
                  <div
                    className="absolute border-2 border-white z-25"
                    style={{
                      left: Math.min(cropArea.x, cropArea.x + cropArea.width),
                      top: Math.min(cropArea.y, cropArea.y + cropArea.height),
                      width: Math.abs(cropArea.width),
                      height: Math.abs(cropArea.height),
                      background: 'rgba(0,0,0,0.3)'
                    }}
                  >
                    <div className="absolute inset-0 border border-dashed border-white/50" />
                  </div>
                )}
                
                {/* Emoji picker */}
                {showEmojiPicker && (
                  <div className="absolute top-12 md:top-16 left-1/2 -translate-x-1/2 z-40 bg-black/90 p-2 md:p-4 rounded-lg shadow-lg">
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-1 md:gap-2 mb-2">
                      {commonEmojis.map(emoji => (
                        <button
                          key={emoji}
                          className="text-lg md:text-2xl hover:bg-gray-700 p-1 md:p-2 rounded"
                          onClick={() => handleEmojiSelect(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <button
                      className="w-full bg-gray-700 text-white py-1 px-2 rounded text-xs md:text-sm"
                      onClick={() => setShowEmojiPicker(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : attachment.type === 'video' ? (
              <video
                src={attachment.url}
                controls
                className="max-w-[90vw] md:max-w-2xl w-full max-h-[50vh] md:max-h-[60vh] rounded-xl shadow-lg bg-black object-contain"
                style={{ maxHeight: '50vh' }}
              />
            ) : attachment.type === 'audio' ? (
              <div className="bg-gray-800 p-4 md:p-8 rounded-lg">
                <audio
                  src={attachment.url}
                  controls
                  className="w-full"
                />
              </div>
            ) : (
              <div className="bg-gray-800 p-4 md:p-8 rounded-lg">
                <a
                  href={attachment.url}
                  download={attachment.name}
                  className="text-blue-400 hover:text-blue-300 flex items-center space-x-2"
                >
                  <FiDownload className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Download {attachment.name}</span>
                </a>
              </div>
            )}
            
            {attachments.length > 1 && (
              <button onClick={handleNext} className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-60 hover:bg-opacity-90 text-white rounded-full p-1.5 md:p-2 z-10">
                <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            )}
          </div>
        </div>

        {/* Bottom section */}
        <div className="bg-gray-900">
          {/* Media thumbnails at bottom */}
          <div className="flex items-center justify-center py-1 md:py-2 space-x-1 md:space-x-2">
            {/* Thumbnails for all attachments */}
            {attachments.map((att, idx) => (
              <div
                key={idx}
                className={`relative w-8 h-8 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 ${idx === currentMediaIndex ? 'border-green-500' : 'border-gray-700'} bg-gray-800 cursor-pointer flex flex-col items-center justify-center`}
                onClick={() => {
                  setCurrentMediaIndex(idx);
                  setCurrentTool('none');
                }}
              >
                {att.type === 'image' ? (
                  <img
                    src={att.url}
                    alt={att.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-xs">
                    {att.type.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Remove icon at top-right of thumbnail */}
                {attachments.length > 1 && (
                  <button
                    className="absolute top-0.5 md:top-1 right-0.5 md:right-1 bg-white text-black rounded-full p-0.5 shadow hover:bg-red-500 hover:text-white z-20 border border-gray-300"
                    onClick={e => { 
                      e.stopPropagation(); 
                      if (onRemoveMedia) onRemoveMedia(idx); 
                    }}
                    title="Remove"
                  >
                    <FiX className="w-2 h-2 md:w-3 md:h-3" />
                  </button>
                )}
              </div>
            ))}
            
            {/* Add more button */}
            {onAddMore && (
              <div
                className="w-8 h-8 md:w-12 md:h-12 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={onAddMore}
                title="Add more media"
              >
                <FiPlus className="w-4 h-4 md:w-6 md:h-6 text-gray-300" />
              </div>
            )}
          </div>

          {/* Caption input and send */}
          <div className="px-2 md:px-4 pb-2 md:pb-4 flex items-end space-x-2 md:space-x-3">
            <div className="flex-1 bg-gray-800 rounded-full px-3 md:px-4 py-1.5 md:py-2 flex items-center">
              <input
                type="text"
                placeholder="Add a caption..."
                value={caption}
                onChange={handleCaptionChange}
                className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm md:text-base outline-none"
                maxLength={1024}
              />
              <button 
                className="text-gray-400 hover:text-white ml-1 md:ml-2 transition-colors"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Add emoji to caption"
              >
                <FiSmile className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
            
            {/* Send button - Green circle with arrow */}
            <button
              onClick={handleSend}
              className="bg-green-500 hover:bg-green-600 rounded-full p-2 md:p-3 transition-colors shadow-lg"
              title="Send"
            >
              <svg className="w-4 h-4 md:w-6 md:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Current tool indicator */}
        {currentTool !== 'none' && (
          <div className="absolute bottom-16 md:bottom-20 left-2 md:left-4 bg-black/70 text-white px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm z-30">
            {currentTool === 'draw' && (isEraser ? 'Eraser' : 'Draw')}
            {currentTool === 'text' && 'Add Text'}
            {currentTool === 'rect' && 'Rectangle'}
            {currentTool === 'blur' && 'Blur/Mosaic'}
            {currentTool === 'emoji' && 'Add Emoji'}
            {currentTool === 'crop' && 'Crop Image'}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};