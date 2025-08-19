import { VideoSession } from '../../../../application/services/session.service';

export interface CreateSessionModalProps {
    setShowCreateModal: (show: boolean) => void;
    createSession?: (session: VideoSession) => void;
    editSession?: (session: VideoSession) => void;
    sessionToEdit?: VideoSession | null;
  }