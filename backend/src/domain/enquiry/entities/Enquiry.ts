import { EnquiryStatus, EnquiryProps, CreateEnquiryProps, UpdateEnquiryProps } from "./EnquiryTypes";

export type { EnquiryProps };

export class Enquiry {
  constructor(public props: EnquiryProps) {}

  // Getters
  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get email() { return this.props.email; }
  get subject() { return this.props.subject; }
  get message() { return this.props.message; }
  get status() { return this.props.status; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  static create(props: CreateEnquiryProps): Enquiry {
    // Basic validation
    const missingFields = [];
    if (!props.name || props.name.trim().length === 0) missingFields.push('name');
    if (!props.email || props.email.trim().length === 0) missingFields.push('email');
    if (!props.subject || props.subject.trim().length === 0) missingFields.push('subject');
    if (!props.message || props.message.trim().length === 0) missingFields.push('message');
    
    if (missingFields.length > 0) {
      console.error('[Enquiry.create] Missing required fields:', missingFields);
      console.error('[Enquiry.create] Props received:', props);
      throw new Error("Missing required fields for enquiry creation");
    }

    const now = new Date();
    return new Enquiry({
      ...props,
      id: undefined,
      status: props.status || EnquiryStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    });
  }

  static update(existingProps: EnquiryProps, updateData: Partial<EnquiryProps>): Enquiry {
    // Merge existing props with update data
    const updatedProps: EnquiryProps = {
      ...existingProps,
      ...updateData,
      // Ensure id is preserved
      id: existingProps.id,
      // Preserve immutable fields
      createdAt: existingProps.createdAt,
      // Update the updatedAt timestamp
      updatedAt: new Date(),
    };
    
    return new Enquiry(updatedProps);
  }

  // Instance methods
  updateStatus(status: EnquiryStatus): Enquiry {
    return new Enquiry({
      ...this.props,
      status,
      updatedAt: new Date(),
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
} 