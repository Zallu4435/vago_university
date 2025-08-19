interface DepartmentAboutData {
    poster: {
        title: string;
        subtitle: string;
    };
    about: {
        title: string;
        description: string;
    };
    deanWelcome: {
        title: string;
        content: string;
        linkText: string;
    };
    management: Array<{
        name: string;
        title: string;
    }>;
    alumni: Array<{
        name: string;
        title: string;
        company: string;
    }>;
}

interface DepartmentCommunityData {
    poster: {
        title: string;
        subtitle: string;
    };
    about: {
        title: string;
        description: string;
    };
    community: {
        title: string;
        studentLife: {
            description: string;
            aspects: CommunityAspect[];
        };
        events: {
            title: string;
            list: CommunityEvent[];
        };
    };
    supportWellness: {
        title: string;
        resources: SupportResource[];
    };
    emergencyContact: {
        title: string;
        contacts: EmergencyContact[];
    };
}


export interface DepartmentAboutDataMap {
    [key: string]: DepartmentAboutData;
}

export interface DepartmentCommunityDataMap {
    [key: string]: DepartmentCommunityData;
}


interface CommunityEvent {
    date: string;
    title: string;
    description: string;
}

interface CommunityAspect {
    title: string;
    description: string;
    icon: React.ElementType;
}

interface SupportResource {
    title: string;
    description: string;
    icon: React.ElementType;
}

interface EmergencyContact {
    title: string;
    phone: string;
    email: string;
}


interface Programme {
    title: string;
    description: string;
    status: string;
    image: string;
}

interface DepartmentEducationData {
    poster: {
        title: string;
        subtitle: string;
    };
    programmes: {
        title: string;
        list: Programme[];
    };
}

export interface DepartmentEducationDataMap {
    [key: string]: DepartmentEducationData;
}

interface AlumniTestimonial {
    name: string;
    title: string;
    company: string;
    testimonial: string;
}

interface HowWeDoItAspect {
    title: string;
    description: string;
    icon: React.ElementType;
}

interface EntrepreneurshipData {
    poster: {
        title: string;
        subtitle: string;
    };
    whatWeDo: {
        title: string;
        description: string;
    };
    howWeDoIt: {
        title: string;
        aspects: HowWeDoItAspect[];
    };
    alumni: {
        title: string;
        testimonials: AlumniTestimonial[];
    };
}

export interface EntrepreneurshipDataMap {
    [key: string]: EntrepreneurshipData;
}


interface DepartmentData {
    poster: {
        title: string;
        subtitle: string;
        description: string;
        ctaText: string;
    };
    inMemoriam: {
        title: string;
        content: string;
        linkText: string;
    };
    spotlight: Array<{
        image: string;
        title: string;
        date: string;
        description: string;
        category: string;
        readTime: string;
    }>;
    education: {
        title: string;
        undergraduate: {
            title: string;
            content: string;
            features: string[];
            image: string;
        };
        graduate: {
            title: string;
            content: string;
            features: string[];
            status: string;
        };
    };
    byTheNumbers: {
        title: string;
        stats: Array<{
            value: string;
            label: string;
            icon: React.ElementType;
        }>;
    };
    events: Array<{
        date: string;
        month: string;
        title: string;
        description: string;
        type: string;
        attendees: string;
    }>;
}

export interface DepartmentDataMap {
    [key: string]: DepartmentData;
}
