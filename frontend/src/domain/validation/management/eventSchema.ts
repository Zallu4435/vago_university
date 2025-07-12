import { z } from 'zod';
import { EVENT_VALIDATION_MESSAGES } from '../../../shared/constants/eventManagementConstants';

export const eventSchema = z.object({
  title: z.string().min(1, EVENT_VALIDATION_MESSAGES.titleRequired).min(3, 'Title must be at least 3 characters'),
  date: z.string().min(1, EVENT_VALIDATION_MESSAGES.dateRequired),
  time: z.string().min(1, EVENT_VALIDATION_MESSAGES.timeRequired),
  location: z.string().min(1, EVENT_VALIDATION_MESSAGES.locationRequired).min(3, 'Location must be at least 3 characters'),
  organizer: z.string().min(1, EVENT_VALIDATION_MESSAGES.organizerRequired).min(2, 'Organizer name must be at least 2 characters'),
  organizerType: z.enum(['department', 'club', 'student', 'administration', 'external'], {
    errorMap: () => ({ message: EVENT_VALIDATION_MESSAGES.organizerTypeRequired }),
  }),
  eventType: z.enum(['workshop', 'seminar', 'fest', 'competition', 'exhibition', 'conference', 'hackathon', 'cultural', 'sports', 'academic'], {
    errorMap: () => ({ message: EVENT_VALIDATION_MESSAGES.eventTypeRequired }),
  }),
  timeframe: z.string().optional(),
  icon: z.string().default('📅'),
  color: z.string().default('#8B5CF6'),
  description: z.string().optional(),
  fullTime: z.boolean().default(false),
  additionalInfo: z.string().optional(),
  requirements: z.string().optional(),
  maxParticipants: z.number().min(0, EVENT_VALIDATION_MESSAGES.maxParticipantsPositive).default(0),
  registrationRequired: z.boolean().default(false),
}); 