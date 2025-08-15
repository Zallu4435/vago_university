import { Document } from 'mongoose';

export enum SiteSectionKey {
  Highlights = 'highlights',
  VagoNow = 'vagoNow',
  Leadership = 'leadership',
}

export interface ISiteSectionBase {
  id?: string;
  sectionKey: SiteSectionKey;
  title?: string;
  description?: string;
  content?: string;
  bio?: string;
  image?: string;
  photo?: string;
  link?: string;
  position?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IHighlightSection extends ISiteSectionBase {
  sectionKey: SiteSectionKey.Highlights;
  title: string;
  description: string;
  image?: string;
  link?: string;
  category?: string;
}

export interface IVagoNowSection extends ISiteSectionBase {
  sectionKey: SiteSectionKey.VagoNow;
  title: string;
  content: string;
  image?: string;
  link?: string;
  category?: string;
}

export interface ILeadershipSection extends ISiteSectionBase {
  sectionKey: SiteSectionKey.Leadership;
  title: string;
  position: string;
  bio?: string;
  photo?: string;
  link?: string;
  category?: string;
}

export interface ISiteSectionDocument extends Document {
  sectionKey: SiteSectionKey;
  title: string;
  description: string;
  image: string;
  link: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ISiteSection = IHighlightSection | IVagoNowSection | ILeadershipSection; 