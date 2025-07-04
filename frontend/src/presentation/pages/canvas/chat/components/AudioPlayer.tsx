import React, { useEffect, useRef, useState } from 'react';
import { FiPlay, FiPause, FiMic } from 'react-icons/fi';
import WaveSurfer from 'wavesurfer.js';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  // Helper to initialize WaveSurfer
  const initWaveSurfer = () => {
    if (waveformRef.current) {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#d1fae5',
        progressColor: '#22c55e',
        cursorColor: '#22c55e',
        barWidth: 2,
        barRadius: 2,
        height: 32,
        responsive: false, // We'll handle resizing manually
        normalize: true,
        partialRender: true,
      });
      wavesurfer.current.load(src);

      wavesurfer.current.on('ready', () => {
        setDuration(wavesurfer.current?.getDuration() || 0);
        setCurrent(0);
        // Force a redraw in case of flexbox issues
        wavesurfer.current?.drawBuffer();
      });
      wavesurfer.current.on('audioprocess', () => {
        setCurrent(wavesurfer.current?.getCurrentTime() || 0);
      });
      wavesurfer.current.on('seek', () => {
        setCurrent(wavesurfer.current?.getCurrentTime() || 0);
      });
      wavesurfer.current.on('finish', () => {
        setPlaying(false);
        setCurrent(0);
      });
    }
  };

  useEffect(() => {
    initWaveSurfer();
    // Clean up on unmount
    return () => {
      wavesurfer.current && wavesurfer.current.destroy();
    };
    // eslint-disable-next-line
  }, [src]);

  // Optional: Handle resizing
  useEffect(() => {
    const handleResize = () => {
      if (wavesurfer.current) {
        wavesurfer.current.drawer.containerWidth = waveformRef.current?.clientWidth || 0;
        wavesurfer.current.drawBuffer();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const togglePlay = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setPlaying(!playing);
    }
  };

  return (
    <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-[#2a3942] w-full max-w-xs">
      <button
        onClick={togglePlay}
        className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
      >
        {playing ? <FiPause /> : <FiPlay />}
      </button>
      <FiMic className="text-green-500" />
      <div
        ref={waveformRef}
        className="flex-1 min-w-0"
        style={{ minWidth: 120, width: 160, height: 32 }}
      />
      <span className="text-xs text-gray-600 dark:text-gray-300 min-w-[40px] text-right">
        {Math.floor(current / 60)}:{('0' + Math.floor(current % 60)).slice(-2)}
      </span>
    </div>
  );
};

export default AudioPlayer; 