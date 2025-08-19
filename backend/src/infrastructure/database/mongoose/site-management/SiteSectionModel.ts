import { Schema, model } from "mongoose";
import { ISiteSectionDocument, SiteSectionKey } from "../../../../domain/site-management/entities/SiteSectionTypes";

const SiteSectionSchema = new Schema<ISiteSectionDocument>(
  {
    sectionKey: { 
      type: String, 
      required: true, 
      enum: Object.values(SiteSectionKey),
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