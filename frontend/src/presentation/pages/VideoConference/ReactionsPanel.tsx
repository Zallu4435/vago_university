import React, { useEffect } from 'react';
import { ReactionsPanelProps } from '../../../domain/types/videoConference';

export const ReactionsPanel: React.FC<ReactionsPanelProps> = ({ reactions, onRemoveReaction }) => {
  useEffect(() => {
    const timers = Object.keys(reactions).map(pid =>
      setTimeout(() => onRemoveReaction(pid), 2000)
    );
    return () => { timers.forEach(clearTimeout); };
  }, [reactions, onRemoveReaction]);

  return null; 
}; 