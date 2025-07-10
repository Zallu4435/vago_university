import React from 'react';
import { FaHandPaper } from 'react-icons/fa';
import { HandRaiseIndicatorProps } from '../../../domain/types/videoConference';


export const HandRaiseIndicator: React.FC<HandRaiseIndicatorProps> = ({ show }) =>
  show ? <FaHandPaper className="text-yellow-400 animate-bounce text-lg ml-1" /> : null; 