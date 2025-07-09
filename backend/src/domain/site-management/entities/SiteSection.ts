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
  get title() { return (this._props as any).title; }
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
