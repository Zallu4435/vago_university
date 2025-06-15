import mongoose, { Schema, Document } from 'mongoose';
import { VideoStatus } from '../../../../domain/video/enums/VideoStatus';

export interface IVideo extends Document {
    title: string;
    duration: string;
    uploadedAt: Date;
    module: number;
    status: VideoStatus;
    diplomaId: mongoose.Types.ObjectId;
    description: string;
    videoUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const videoSchema = new Schema<IVideo>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        duration: {
            type: String,
            required: [true, 'Duration is required'],
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
        module: {
            type: Number,
            required: [true, 'Module number is required'],
            min: [1, 'Module number must be at least 1'],
        },
        status: {
            type: String,
            enum: {
                values: Object.values(VideoStatus),
                message: 'Invalid status value',
            },
            default: VideoStatus.Draft,
        },
        diplomaId: {
            type: Schema.Types.ObjectId,
            ref: 'Diploma',
            required: [true, 'Diploma ID is required'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        videoUrl: {
            type: String,
            required: [true, 'Video URL is required'],
        },
    },
    {
        timestamps: true,
    }
);

// Add indexes for better query performance
videoSchema.index({ diplomaId: 1, module: 1 });
videoSchema.index({ status: 1 });
videoSchema.index({ uploadedAt: -1 });

// Add validation methods
videoSchema.pre('save', function(next) {
    if (this.isModified('module') && this.module < 1) {
        next(new Error('Module number must be at least 1'));
    }
    next();
});

export const Video = mongoose.model<IVideo>('Video', videoSchema); 