import { SiteSectionErrorType } from '../enums/SiteSectionErrorType';

export enum SiteSectionKey {
  Highlights = 'highlights',
  VagoNow = 'vagoNow',
  Leadership = 'leadership',
}

export interface SiteSectionProps {
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
  createdAt?: string;
  updatedAt?: string;
}

export class SiteSection {
  private _id?: string;
  private _sectionKey: SiteSectionKey;
  private _title?: string;
  private _description?: string;
  private _content?: string;
  private _bio?: string;
  private _image?: string;
  private _photo?: string;
  private _link?: string;
  private _position?: string;
  private _category?: string;
  private _createdAt?: string;
  private _updatedAt?: string;

  constructor(props: SiteSectionProps) {
    this._id = props.id;
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
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: SiteSectionProps): SiteSection {
    if (!props.sectionKey) {
      throw new Error(SiteSectionErrorType.InvalidSectionKey);
    }
    if (props.sectionKey === SiteSectionKey.Highlights && (!props.title || !props.description)) {
      throw new Error(SiteSectionErrorType.InvalidHighlight);
    }
    if (props.sectionKey === SiteSectionKey.VagoNow && (!props.title || !props.content)) {
      throw new Error(SiteSectionErrorType.InvalidVagoNow);
    }
    if (props.sectionKey === SiteSectionKey.Leadership && (!props.title || !props.position)) {
      throw new Error(SiteSectionErrorType.InvalidLeadership);
    }
    return new SiteSection(props);
  }

  get id(): string | undefined { return this._id; }
  get sectionKey(): SiteSectionKey { return this._sectionKey; }
  get title(): string | undefined { return this._title; }
  get description(): string | undefined { return this._description; }
  get content(): string | undefined { return this._content; }
  get bio(): string | undefined { return this._bio; }
  get image(): string | undefined { return this._image; }
  get photo(): string | undefined { return this._photo; }
  get link(): string | undefined { return this._link; }
  get position(): string | undefined { return this._position; }
  get category(): string | undefined { return this._category; }
  get createdAt(): string | undefined { return this._createdAt; }
  get updatedAt(): string | undefined { return this._updatedAt; }
}
