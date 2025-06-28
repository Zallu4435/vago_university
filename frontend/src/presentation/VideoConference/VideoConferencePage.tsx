import React, { useState, useMemo, useEffect } from 'react';
import { VideoGrid, Participant } from './VideoGrid';
import { ControlBar } from './ControlBar';
import { ChatPanel } from './ChatPanel';
import { TopBar } from './TopBar';

const initialParticipants: Participant[] = [
  { id: '1', name: 'Alice Johnson', videoOn: true, audioOn: true, handRaised: false, isHost: true },
  { id: '2', name: 'Bob Smith', videoOn: false, audioOn: false, handRaised: true },
  { id: '3', name: 'Charlie Brown', videoOn: true, audioOn: false, handRaised: false, isPresenting: true },
  { id: '4', name: 'Diana Prince', videoOn: false, audioOn: true, handRaised: false },
  { id: '5', name: 'Eve Adams', videoOn: true, audioOn: true, handRaised: false },
  { id: '6', name: 'Frank Miller', videoOn: false, audioOn: false, handRaised: false },
  { id: '7', name: 'Grace Lee', videoOn: true, audioOn: true, handRaised: false },
  { id: '8', name: 'Henry Ford', videoOn: false, audioOn: true, handRaised: true },
  { id: '9', name: 'Ivy Green', videoOn: true, audioOn: false, handRaised: false },
  { id: '10', name: 'Jack White', videoOn: false, audioOn: true, handRaised: false },
  { id: '11', name: 'Karen Black', videoOn: true, audioOn: true, handRaised: false },
  { id: '12', name: 'Leo King', videoOn: false, audioOn: false, handRaised: false },
  { id: '13', name: 'Mona Lisa', videoOn: true, audioOn: true, handRaised: false },
  { id: '14', name: 'Nina Simone', videoOn: false, audioOn: true, handRaised: false },
  { id: '15', name: 'Oscar Wilde', videoOn: true, audioOn: false, handRaised: false },
  { id: '16', name: 'Paul Allen', videoOn: false, audioOn: true, handRaised: false },
  { id: '17', name: 'Quinn Fox', videoOn: true, audioOn: true, handRaised: false },
  { id: '18', name: 'Rita Ora', videoOn: false, audioOn: false, handRaised: false },
  { id: '19', name: 'Sam Wise', videoOn: true, audioOn: true, handRaised: false },
  { id: '20', name: 'Tina Fey', videoOn: false, audioOn: true, handRaised: false },
];

const initialMessages = [
  { id: 'm1', user: 'Alice Johnson', text: 'Welcome everyone to our meeting!', timestamp: '10:00' },
  { id: 'm2', user: 'Bob Smith', text: 'Thanks for having us!', timestamp: '10:01' },
  { id: 'm3', user: 'Charlie Brown', text: 'Can everyone see my screen?', timestamp: '10:02' },
];

// Enhanced hook for better grid capacity calculation
function useGridCapacity() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  React.useEffect(() => {
    const onResize = () => setSize({ 
      width: window.innerWidth, 
      height: window.innerHeight 
    });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Intelligent capacity calculation based on screen size
  const capacity = useMemo(() => {
    const { width, height } = size;
    // Account for header (80px) + control bar (96px) + padding (32px) = 208px
    const availableHeight = height - 208;
    
    if (width < 640) {
      // Mobile: prioritize fewer, larger tiles
      return Math.min(6, initialParticipants.length);
    } else if (width < 1024) {
      // Tablet: moderate capacity
      return Math.min(12, initialParticipants.length);
    } else {
      // Desktop: can handle more participants
      const optimalCapacity = width < 1280 ? 16 : 25;
      return Math.min(optimalCapacity, initialParticipants.length);
    }
  }, [size.width, size.height]);

  return capacity;
}

export const VideoConferencePage: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [messages, setMessages] = useState(initialMessages);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [othersOpen, setOthersOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [meetingSeconds, setMeetingSeconds] = useState(0);
  const [reactions, setReactions] = useState<Array<{id: string, emoji: string, sender: string, timestamp: number}>>([]);

  const gridCapacity = useGridCapacity();
  const visibleParticipants = useMemo(() => participants.slice(0, gridCapacity), [participants, gridCapacity]);
  const others = useMemo(() => participants.slice(gridCapacity), [participants, gridCapacity]);

  useEffect(() => {
    const interval = setInterval(() => setMeetingSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Clean up old reactions (older than 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setReactions(prev => prev.filter(reaction => now - reaction.timestamp < 3000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const meetingTimer = useMemo(() => {
    const m = Math.floor(meetingSeconds / 60).toString().padStart(2, '0');
    const s = (meetingSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [meetingSeconds]);

  const handleToggleMic = () => setMicOn((v) => !v);
  const handleToggleCamera = () => setCameraOn((v) => !v);
  const handleToggleHand = () => setHandRaised((v) => !v);
  const handleSendReaction = (emoji: string) => {
    const newReaction = {
      id: Date.now().toString(),
      emoji,
      sender: 'You',
      timestamp: Date.now()
    };
    setReactions(prev => [...prev, newReaction]);
  };
  const handleLeave = () => alert('Left the call');
  const handleShareScreen = () => alert('Screen sharing started');
  const handleSendMessage = (message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `m${prev.length + 1}`,
        user: 'You',
        text: message,
        timestamp: new Date().toLocaleTimeString().slice(0, 5),
      },
    ]);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col overflow-hidden">
      <TopBar sessionName="Product Strategy Meeting" meetingTimer={meetingTimer} />
      
      {/* Reactions Overlay */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {reactions.map((reaction, index) => (
          <div
            key={reaction.id}
            className="absolute bottom-32 left-8 animate-reaction-flow"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: '3s'
            }}
          >
            <div className="flex flex-col items-start">
              <div className="text-4xl mb-1 animate-bounce">
                {reaction.emoji}
              </div>
              <div className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                {reaction.sender}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col min-h-0 relative pt-20 pb-24">
        <VideoGrid 
          participants={visibleParticipants} 
          compact={others.length > 0}
          maxVisible={gridCapacity}
        />
        
        {/* Others Button - Better positioned */}
        {others.length > 0 && (
          <button
            onClick={() => setOthersOpen(true)}
            className="absolute bottom-28 right-4 px-4 py-2 bg-gray-800/90 backdrop-blur-sm text-white rounded-full shadow-lg z-30 hover:bg-gray-700 transition-all duration-200 border border-gray-600/50 font-medium"
          >
            +{others.length} others
          </button>
        )}
        
        {/* Others Modal - Enhanced */}
        {othersOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Other Participants ({others.length})
                </h2>
                <button
                  onClick={() => setOthersOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-96 p-4">
                <ul className="space-y-3">
                  {others.map((participant) => (
                    <li key={participant.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 truncate">
                          {participant.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {participant.isHost && (
                            <span className="text-xs text-orange-600 font-medium bg-orange-100 px-2 py-0.5 rounded-full">
                              Host
                            </span>
                          )}
                          {participant.isPresenting && (
                            <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded-full">
                              Presenting
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {!participant.audioOn && <span className="text-red-500 text-xs">🔇 Muted</span>}
                          {participant.handRaised && <span className="text-yellow-500 text-xs">✋ Hand raised</span>}
                          {participant.audioOn && !participant.handRaised && (
                            <span className="text-green-500 text-xs">🎤 Active</span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={messages}
        onSend={handleSendMessage}
      />
      
      <ControlBar
        onToggleMic={handleToggleMic}
        onToggleCamera={handleToggleCamera}
        onToggleHand={handleToggleHand}
        onSendReaction={handleSendReaction}
        onLeave={handleLeave}
        onShareScreen={handleShareScreen}
        onToggleChat={() => setChatOpen(!chatOpen)}
        onToggleOthers={() => setOthersOpen(true)}
        micOn={micOn}
        cameraOn={cameraOn}
        handRaised={handRaised}
      />
    </div>
  );
};