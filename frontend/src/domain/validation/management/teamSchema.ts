import { z } from 'zod';

export const teamSchema = z.object({
  title: z.string().min(2, 'Team name must be at least 2 characters'),
  type: z.string().min(1, 'Sport type is required'),
  category: z.string().min(1, 'Team category is required'),
  organizer: z.string().min(2, 'Organizer name is required'),
  organizerType: z.enum(['department', 'club', 'student', 'administration', 'external'], {
    errorMap: () => ({ message: 'Organizer type is required' }),
  }),
  icon: z.string().default('⚽'),
  color: z.string().default('#8B5CF6'),
  division: z.string().min(1, 'Division is required'),
  headCoach: z.string().min(2, 'Head coach name is required'),
  homeGames: z.number().min(0, 'Home games must be 0 or greater'),
  record: z.string().regex(/^[0-9]+-[0-9]+-[0-9]+$/, 'Record must be in format: W-L-T'),
  upcomingGames: z.array(
    z.object({
      date: z.string().min(10, 'Date is required'),
      description: z.string().min(5, 'Description must be at least 5 characters'),
    })
  ).min(1, 'At least one upcoming game is required'),
  participants: z.number().min(0, 'Participants must be 0 or greater').default(0),
  status: z.string().regex(/^(active|inactive)$/i, 'Status must be Active or Inactive').default('Active'),
}); 