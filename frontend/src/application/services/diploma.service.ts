import { dummyData } from "../../presentation/pages/admin/diploma/dummyData";

interface Video {
    _id: string;
    title: string;
    duration: string;
    uploadedAt: string;
    module: number;
    status: "Published" | "Draft";
    diplomaId: string;
    description: string;
}

interface Diploma {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    thumbnail: string;
    duration: string;
    prerequisites: string[];
    status: boolean;
    createdAt: string;
    updatedAt: string;
    videoIds: string[];
}

interface Enrollment {
    _id: string;
    studentName: string;
    studentEmail: string;
    courseTitle: string;
    enrollmentDate: string;
    status: "Approved" | "Pending" | "Rejected";
    progress: number;
}

export const diplomaService = {
    async getDiplomas(page: number, limit: number): Promise<{ diplomas: Diploma[]; totalPages: number }> {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const diplomas = dummyData.diplomas.slice(startIndex, endIndex);
        const totalPages = Math.ceil(dummyData.diplomas.length / limit);
        return { diplomas, totalPages };
    },

    async getVideos(diplomaId: string, page: number, limit: number, status?: string): Promise<{ videos: Video[]; totalPages: number }> {
        const startIndex = (page - 1) * limit;
        let videos = diplomaId 
            ? dummyData.videos.filter((video) => video.diplomaId === diplomaId)
            : dummyData.videos;
            
        if (status && status !== 'all') {
            videos = videos.filter((video) => video.status.toLowerCase() === status.toLowerCase());
        }
        const totalPages = Math.ceil(videos.length / limit);
        videos = videos.slice(startIndex, startIndex + limit);
        return { videos, totalPages };
    },

    async createVideo(diplomaId: string, videoData: Omit<Video, '_id' | 'uploadedAt'>): Promise<Video> {
        const newVideo: Video = {
            _id: `V${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            ...videoData,
            uploadedAt: new Date().toISOString(),
        };
        dummyData.videos.push(newVideo);

        // Update diploma's videoIds
        const diploma = dummyData.diplomas.find((d) => d._id === diplomaId);
        if (diploma) {
            diploma.videoIds.push(newVideo._id);
        } else {
            throw new Error('Diploma not found');
        }

        return newVideo;
    },

    async updateVideo(videoId: string, videoData: Partial<Video>): Promise<Video> {
        const videoIndex = dummyData.videos.findIndex((v) => v._id === videoId);
        if (videoIndex === -1) {
            throw new Error('Video not found');
        }
        const updatedVideo = { ...dummyData.videos[videoIndex], ...videoData };
        dummyData.videos[videoIndex] = updatedVideo;
        return updatedVideo;
    },

    async deleteVideo(diplomaId: string, videoId: string): Promise<void> {
        const videoIndex = dummyData.videos.findIndex((v) => v._id === videoId);
        if (videoIndex === -1) {
            throw new Error('Video not found');
        }
        dummyData.videos.splice(videoIndex, 1);

        // Remove videoId from diploma's videoIds
        const diploma = dummyData.diplomas.find((d) => d._id === diplomaId);
        if (diploma) {
            diploma.videoIds = diploma.videoIds.filter((id) => id !== videoId);
        }
    },

    async getEnrollments(
        page: number,
        limit: number,
        category?: string,
        status?: string
    ): Promise<{ enrollments: Enrollment[]; totalPages: number }> {
        const startIndex = (page - 1) * limit;
        let enrollments = dummyData.enrollments;

        // Filter by category (match courseTitle to diploma category)
        if (category && category !== 'All Categories') {
            const diplomaTitles = dummyData.diplomas
                .filter((d) => d.category === category)
                .map((d) => d.title);
            enrollments = enrollments.filter((e) => diplomaTitles.includes(e.courseTitle));
        }

        // Filter by status
        if (status && status !== 'All') {
            enrollments = enrollments.filter((e) => e.status.toLowerCase() === status.toLowerCase());
        }

        const totalPages = Math.ceil(enrollments.length / limit);
        enrollments = enrollments.slice(startIndex, startIndex + limit);

        return { enrollments, totalPages };
    },

    async getDiplomaDetails(diplomaId: string): Promise<Diploma & { enrolledStudents: Enrollment[] }> {
        const diploma = dummyData.diplomas.find((d) => d._id === diplomaId);
        if (!diploma) {
            throw new Error('Diploma not found');
        }
        const enrolledStudents = dummyData.enrollments
            .filter((e) => e.courseTitle === diploma.title)
            .map((e) => ({
                id: e._id,
                name: e.studentName,
                email: e.studentEmail,
                enrollmentDate: e.enrollmentDate,
                progress: e.progress,
            }));
        return { ...diploma, enrolledStudents };
    },

    async getEnrollmentDetails(enrollmentId: string): Promise<Enrollment> {
        const enrollment = dummyData.enrollments.find((e) => e._id === enrollmentId);
        if (!enrollment) {
            throw new Error('Enrollment not found');
        }
        return enrollment;
    },

    async createDiploma(data: Omit<Diploma, '_id' | 'createdAt' | 'updatedAt'>): Promise<Diploma> {
        const newDiploma: Diploma = {
            _id: `dip_${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            videoIds: [],
        };
        dummyData.diplomas.push(newDiploma);
        return newDiploma;
    },

    async updateDiploma(id: string, data: Partial<Diploma>): Promise<Diploma> {
        const diplomaIndex = dummyData.diplomas.findIndex((d) => d._id === id);
        if (diplomaIndex === -1) {
            throw new Error('Diploma not found');
        }
        const updatedDiploma = {
            ...dummyData.diplomas[diplomaIndex],
            ...data,
            updatedAt: new Date().toISOString(),
        };
        dummyData.diplomas[diplomaIndex] = updatedDiploma;
        return updatedDiploma;
    },

    async deleteDiploma(id: string): Promise<void> {
        const diplomaIndex = dummyData.diplomas.findIndex((d) => d._id === id);
        if (diplomaIndex === -1) {
            throw new Error('Diploma not found');
        }
        // Remove associated videos
        dummyData.videos = dummyData.videos.filter((v) => v.diplomaId !== id);
        // Remove associated enrollments
        const diplomaTitle = dummyData.diplomas[diplomaIndex].title;
        dummyData.enrollments = dummyData.enrollments.filter((e) => e.courseTitle !== diplomaTitle);
        // Remove diploma
        dummyData.diplomas.splice(diplomaIndex, 1);
    },

    async approveEnrollment(requestId: string): Promise<void> {
        const enrollmentIndex = dummyData.enrollments.findIndex((e) => e._id === requestId);
        if (enrollmentIndex === -1) {
            throw new Error('Enrollment not found');
        }
        dummyData.enrollments[enrollmentIndex] = {
            ...dummyData.enrollments[enrollmentIndex],
            status: 'Approved',
        };
    },

    async rejectEnrollment(requestId: string, reason: string): Promise<void> {
        const enrollmentIndex = dummyData.enrollments.findIndex((e) => e._id === requestId);
        if (enrollmentIndex === -1) {
            throw new Error('Enrollment not found');
        }
        dummyData.enrollments[enrollmentIndex] = {
            ...dummyData.enrollments[enrollmentIndex],
            status: 'Rejected',
        };
        // Note: The reason is not stored in dummyData.enrollments; you could extend the Enrollment type if needed
    },

    async resetProgress(requestId: string): Promise<void> {
        const enrollmentIndex = dummyData.enrollments.findIndex((e) => e._id === requestId);
        if (enrollmentIndex === -1) {
            throw new Error('Enrollment not found');
        }
        dummyData.enrollments[enrollmentIndex] = {
            ...dummyData.enrollments[enrollmentIndex],
            progress: 0,
        };
    },
};