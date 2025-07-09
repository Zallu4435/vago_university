import { MaterialProps, CreateMaterialProps, UpdateMaterialProps } from "./MaterialTypes";

export type { MaterialProps };

export class Material {
  constructor(public props: MaterialProps) {}

  get id() { return this.props.id; }
  get title() { return this.props.title; }
  get description() { return this.props.description; }
  get subject() { return this.props.subject; }
  get course() { return this.props.course; }
  get semester() { return this.props.semester; }
  get type() { return this.props.type; }
  get fileUrl() { return this.props.fileUrl; }
  get thumbnailUrl() { return this.props.thumbnailUrl; }
  get tags() { return this.props.tags; }
  get difficulty() { return this.props.difficulty; }
  get estimatedTime() { return this.props.estimatedTime; }
  get isNewMaterial() { return this.props.isNewMaterial; }
  get isRestricted() { return this.props.isRestricted; }
  get uploadedBy() { return this.props.uploadedBy; }
  get uploadedAt() { return this.props.uploadedAt; }
  get views() { return this.props.views; }
  get downloads() { return this.props.downloads; }
  get rating() { return this.props.rating; }

  static create(props: CreateMaterialProps): Material {
    // Basic validation
    const missingFields = [];
    if (!props.title) missingFields.push('title');
    if (!props.description) missingFields.push('description');
    if (!props.subject) missingFields.push('subject');
    if (!props.course) missingFields.push('course');
    if (!props.semester) missingFields.push('semester');
    if (!props.type) missingFields.push('type');
    if (!props.fileUrl) missingFields.push('fileUrl');
    if (!props.thumbnailUrl) missingFields.push('thumbnailUrl');
    if (!props.difficulty) missingFields.push('difficulty');
    if (!props.estimatedTime) missingFields.push('estimatedTime');
    if (props.isNewMaterial === undefined) missingFields.push('isNewMaterial');
    if (props.isRestricted === undefined) missingFields.push('isRestricted');
    if (!props.uploadedBy) missingFields.push('uploadedBy');
    if (missingFields.length > 0) {
      console.error('[Material.create] Missing required fields:', missingFields);
      console.error('[Material.create] Props received:', props);
      throw new Error("Missing required fields for material creation");
    }
    const now = new Date().toISOString();
    return new Material({
      ...props,
      id: undefined,
      uploadedAt: now,
      views: 0,
      downloads: 0,
      rating: 0,
    });
  }

  static update(existingProps: MaterialProps, updateData: Partial<MaterialProps>): Material {
    // Merge existing props with update data
    const updatedProps: MaterialProps = {
      ...existingProps,
      ...updateData,
      // Ensure id is preserved
      id: existingProps.id,
      // Preserve immutable fields
      uploadedAt: existingProps.uploadedAt,
      uploadedBy: existingProps.uploadedBy,
      views: existingProps.views,
      downloads: existingProps.downloads,
      rating: existingProps.rating,
    };
    
    return new Material(updatedProps);
  }
} 