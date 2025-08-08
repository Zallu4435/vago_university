import { SiteSectionKey, ISiteSection, IHighlightSection, IVagoNowSection, ILeadershipSection } from './SiteSectionTypes';
import { SiteSectionErrorType } from '../enums/SiteSectionErrorType';

export type SiteSectionProps = ISiteSection;

export class SiteSection {
  private _props: SiteSectionProps;

  constructor(props: SiteSectionProps) {
    this._props = props;
  }

  static create(props: SiteSectionProps): SiteSection {
    if (!props.sectionKey) {
      throw new Error(SiteSectionErrorType.InvalidSectionKey);
    }
    if (props.sectionKey === SiteSectionKey.Highlights) {
      const highlight = props as IHighlightSection;
      if (!highlight.title || !highlight.description) {
        throw new Error(SiteSectionErrorType.InvalidHighlight);
      }
    }
    if (props.sectionKey === SiteSectionKey.VagoNow) {
      const vagoNow = props as IVagoNowSection;
      if (!vagoNow.title || !vagoNow.content) {
        throw new Error(SiteSectionErrorType.InvalidVagoNow);
      }
    }
    if (props.sectionKey === SiteSectionKey.Leadership) {
      const leader = props as ILeadershipSection;
      if (!leader.title || !leader.position) {
        throw new Error(SiteSectionErrorType.InvalidLeadership);
      }
    }
    return new SiteSection(props);
  }

  get id() { return this._props.id; }
  get sectionKey() { return this._props.sectionKey; }
  get title() { return (this._props).title; }
  get description() { return (this._props as any).description; }
  get content() { return (this._props as any).content; }
  get bio() { return (this._props as any).bio; }
  get image() { return (this._props as any).image; }
  get photo() { return (this._props as any).photo; }
  get link() { return (this._props as any).link; }
  get position() { return (this._props as any).position; }
  get category() { return (this._props as any).category; }
  get createdAt() { return this._props.createdAt; }
  get updatedAt() { return this._props.updatedAt; }
}

// Request Entities
export interface CreateSiteSectionRequestProps {
  sectionKey: SiteSectionKey;
  title: string;
  description?: string;
  content?: string;
  bio?: string;
  image?: string;
  photo?: string;
  link?: string;
  position?: string;
  category?: string;
}

export class CreateSiteSectionRequest {
  private _sectionKey: SiteSectionKey;
  private _title: string;
  private _description?: string;
  private _content?: string;
  private _bio?: string;
  private _image?: string;
  private _photo?: string;
  private _link?: string;
  private _position?: string;
  private _category?: string;

  constructor(props: CreateSiteSectionRequestProps) {
    this._sectionKey = props.sectionKey;
    this._title = props.title;
    this._description = props.description;
    this._content = props.content;
    this._bio = props.bio;
    this._image = props.image;
    this._photo = props.photo;
    this._link = props.link;
    this._position = props.position;
    this._category = props.category;
  }

  static create(props: CreateSiteSectionRequestProps): CreateSiteSectionRequest {
    if (!props.sectionKey) {
      throw new Error('Section key is required');
    }
    if (!props.title) {
      throw new Error('Title is required');
    }
    return new CreateSiteSectionRequest(props);
  }

  get sectionKey(): SiteSectionKey { return this._sectionKey; }
  get title(): string { return this._title; }
  get description(): string | undefined { return this._description; }
  get content(): string | undefined { return this._content; }
  get bio(): string | undefined { return this._bio; }
  get image(): string | undefined { return this._image; }
  get photo(): string | undefined { return this._photo; }
  get link(): string | undefined { return this._link; }
  get position(): string | undefined { return this._position; }
  get category(): string | undefined { return this._category; }
}

export interface UpdateSiteSectionRequestProps {
  id: string;
  title?: string;
  description?: string;
  content?: string;
  bio?: string;
  image?: string;
  photo?: string;
  link?: string;
  position?: string;
  category?: string;
}

export class UpdateSiteSectionRequest {
  private _id: string;
  private _title?: string;
  private _description?: string;
  private _content?: string;
  private _bio?: string;
  private _image?: string;
  private _photo?: string;
  private _link?: string;
  private _position?: string;
  private _category?: string;

  constructor(props: UpdateSiteSectionRequestProps) {
    this._id = props.id;
    this._title = props.title;
    this._description = props.description;
    this._content = props.content;
    this._bio = props.bio;
    this._image = props.image;
    this._photo = props.photo;
    this._link = props.link;
    this._position = props.position;
    this._category = props.category;
  }

  static create(props: UpdateSiteSectionRequestProps): UpdateSiteSectionRequest {
    if (!props.id) {
      throw new Error('ID is required');
    }
    return new UpdateSiteSectionRequest(props);
  }

  get id(): string { return this._id; }
  get title(): string | undefined { return this._title; }
  get description(): string | undefined { return this._description; }
  get content(): string | undefined { return this._content; }
  get bio(): string | undefined { return this._bio; }
  get image(): string | undefined { return this._image; }
  get photo(): string | undefined { return this._photo; }
  get link(): string | undefined { return this._link; }
  get position(): string | undefined { return this._position; }
  get category(): string | undefined { return this._category; }
}

export interface DeleteSiteSectionRequestProps {
  id: string;
}

export class DeleteSiteSectionRequest {
  private _id: string;

  constructor(props: DeleteSiteSectionRequestProps) {
    this._id = props.id;
  }

  static create(props: DeleteSiteSectionRequestProps): DeleteSiteSectionRequest {
    if (!props.id) {
      throw new Error('ID is required');
    }
    return new DeleteSiteSectionRequest(props);
  }

  get id(): string { return this._id; }
}
