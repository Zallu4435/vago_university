import mongoose, { Schema, Document, model } from "mongoose";

export interface ISiteSectionDocument extends Document {
  sectionKey: 'highlights' | 'vagoNow' | 'leadership';
  title: string;
  description: string;
  image: string;
  link: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSectionSchema = new Schema<ISiteSectionDocument>(
  {
    sectionKey: { 
      type: String, 
      required: true, 
      enum: ['highlights', 'vagoNow', 'leadership'],
      index: true 
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    link: { type: String, trim: true },
    category: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Text index for search functionality
SiteSectionSchema.index({ title: "text", description: "text" });

// Compound index for efficient queries
SiteSectionSchema.index({ sectionKey: 1, createdAt: -1 });

export const SiteSectionModel = model<ISiteSectionDocument>('SiteSection', SiteSectionSchema); 