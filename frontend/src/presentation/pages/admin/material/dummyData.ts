import { Material } from '../../../../domain/types/material';

const dummyData: { materials: Material[] } = {
  materials: [
    {
      _id: 'mat_001',
      title: 'Introduction to Calculus',
      description: 'Basic concepts of limits and derivatives.',
      subject: 'Mathematics',
      course: 'B.Sc. Mathematics',
      semester: 1,
      type: 'pdf',
      fileUrl: '/files/calculus_intro.pdf',
      thumbnailUrl: '/thumbnails/calculus.jpg',
      tags: ['calculus', 'math', 'limits'],
      difficulty: 'Beginner',
      estimatedTime: '2 hours',
      isNew: true,
      isRestricted: false,
      uploadedBy: 'Dr. Smith',
      uploadedAt: '2025-05-01T10:00:00Z',
      views: 150,
      downloads: 50,
      rating: 4.5,
    },
    {
      _id: 'mat_002',
      title: 'Data Structures Lecture',
      description: 'Overview of arrays and linked lists.',
      subject: 'Computer Science',
      course: 'B.Tech. CS',
      semester: 3,
      type: 'video',
      fileUrl: '/files/ds_lecture.mp4',
      thumbnailUrl: '/thumbnails/ds.jpg',
      tags: ['data structures', 'programming'],
      difficulty: 'Intermediate',
      estimatedTime: '1 hour',
      isNew: false,
      isRestricted: true,
      uploadedBy: 'Prof. Jones',
      uploadedAt: '2025-04-15T12:00:00Z',
      views: 200,
      downloads: 30,
      rating: 4.0,
    },
    // Add more materials as needed
  ],
};

export default dummyData;