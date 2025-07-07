import React, { useEffect } from 'react';

interface ReactionsPanelProps {
  reactions: { [participantId: string]: string };
  onRemoveReaction: (participantId: string) => void;
}

export const ReactionsPanel: React.FC<ReactionsPanelProps> = ({ reactions, onRemoveReaction }) => {
  useEffect(() => {
    const timers = Object.keys(reactions).map(pid =>
      setTimeout(() => onRemoveReaction(pid), 2000)
    );
    return () => { timers.forEach(clearTimeout); };
  }, [reactions, onRemoveReaction]);

  return null; 
}; 