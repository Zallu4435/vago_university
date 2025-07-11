import { IMaterialsRepository } from '../repositories/IMaterialsRepository';
import { GetMaterialsRequestDTO, GetMaterialByIdRequestDTO, CreateMaterialRequestDTO, UpdateMaterialRequestDTO, DeleteMaterialRequestDTO } from '../../../domain/materials/dtos/MaterialRequestDTOs';
import { GetMaterialsResponseDTO, GetMaterialByIdResponseDTO, CreateMaterialResponseDTO, UpdateMaterialResponseDTO } from '../../../domain/materials/dtos/MaterialResponseDTOs';
import { Material, MaterialProps } from '../../../domain/materials/entities/Material';
import { MaterialNotFoundError, MaterialValidationError } from '../../../domain/materials/errors/MaterialErrors';

function toMaterialProps(raw: any): MaterialProps {
  return {
    id: raw._id?.toString() ?? raw.id,
    title: raw.title,
    description: raw.description,
    subject: raw.subject,
    course: raw.course,
    semester: raw.semester,
    type: raw.type,
    fileUrl: raw.fileUrl,
    thumbnailUrl: raw.thumbnailUrl,
    tags: raw.tags,
    difficulty: raw.difficulty,
    estimatedTime: raw.estimatedTime,
    isNewMaterial: raw.isNewMaterial,
    isRestricted: raw.isRestricted,
    uploadedBy: raw.uploadedBy,
    uploadedAt: raw.uploadedAt,
    views: raw.views,
    downloads: raw.downloads,
    rating: raw.rating,
  };
}

export class GetMaterialsUseCase {
  constructor(private repo: IMaterialsRepository) {}
  async execute(params: GetMaterialsRequestDTO): Promise<GetMaterialsResponseDTO> {
    console.log('=== GetMaterialsUseCase DEBUG ===');
    console.log('Received params:', params);
    
    // Debug: Fetch some sample materials to see actual database values
    try {
      const sampleMaterials = await this.repo.find({}, { skip: 0, limit: 5, sort: { uploadedAt: -1 } });
      console.log('=== SAMPLE MATERIALS FROM DATABASE ===');
      sampleMaterials.forEach((material, index) => {
        console.log(`Material ${index + 1}:`, {
          title: material.title,
          subject: material.subject,
          course: material.course,
          semester: material.semester
        });
      });
      
      // Get all unique courses in database
      const allMaterials = await this.repo.find({}, { skip: 0, limit: 100, sort: { uploadedAt: -1 } });
      const uniqueCourses = [...new Set(allMaterials.map(m => m.course))];
      console.log('=== ALL UNIQUE COURSES IN DATABASE ===');
      console.log('Courses:', uniqueCourses);
      console.log('=== END UNIQUE COURSES ===');
      
      console.log('=== END SAMPLE MATERIALS ===');
    } catch (error) {
      console.log('Error fetching sample materials:', error);
    }
    
    // Build query/filter logic here (not in repository)
    const filter: any = {};
    
    // Existing filters
    if (params.subject && params.subject !== 'All Subjects' && params.subject !== 'all' && params.subject !== 'All') {
      // Normalize subject filter: convert underscores to spaces and capitalize words
      const normalizedSubject = params.subject
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      filter.subject = normalizedSubject;
      console.log('Subject filter applied:', params.subject, '-> normalized to:', normalizedSubject);
    }
    if (params.course && params.course !== 'All Courses' && params.course !== 'all') {
      // Normalize course filter: convert underscores to spaces and capitalize words
      let normalizedCourse = params.course;
      
      // Handle special cases first
      if (normalizedCourse.toLowerCase().includes('b.tech')) {
        normalizedCourse = normalizedCourse.replace(/b\.tech/gi, 'B.Tech.');
      } else if (normalizedCourse.toLowerCase().includes('b.sc')) {
        normalizedCourse = normalizedCourse.replace(/b\.sc/gi, 'B.Sc.');
      } else if (normalizedCourse.toLowerCase().includes('m.sc')) {
        normalizedCourse = normalizedCourse.replace(/m\.sc/gi, 'M.Sc.');
      }
      
      // Convert underscores to spaces and capitalize remaining words
      normalizedCourse = normalizedCourse
        .split('_')
        .map(word => {
          // Skip if already processed (B.Tech., B.Sc., M.Sc.)
          if (word === 'B.Tech.' || word === 'B.Sc.' || word === 'M.Sc.') {
            return word;
          }
          // Handle CS abbreviation only if it's a standalone word
          if (word.toLowerCase() === 'cs') {
            return 'CS';
          }
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
      
      // Clean up any double dots
      normalizedCourse = normalizedCourse.replace(/\.\./g, '.');
      
      filter.course = normalizedCourse;
      console.log('Course filter applied:', params.course, '-> normalized to:', normalizedCourse);
      
      // Debug: Show what we're searching for vs what's in database
      console.log('Searching for course:', JSON.stringify(normalizedCourse));
      console.log('Database has courses:', ['B.Sc. Mathematics', 'B.Tech. CS']);
    }
    if (
      params.semester !== undefined &&
      params.semester !== null &&
      params.semester !== 'All Semesters' &&
      params.semester !== 'all'
    ) {
      // Convert string to number if needed
      const semesterValue = typeof params.semester === 'string' ? parseInt(params.semester, 10) : params.semester;
      if (!isNaN(semesterValue) && semesterValue > 0) {
        filter.semester = semesterValue;
        console.log('Semester filter applied:', params.semester, '-> converted to:', semesterValue);
      } else {
        console.log('Invalid semester value:', params.semester);
      }
    }

    // Search functionality
    if (params.search && params.search.trim()) {
      const searchRegex = new RegExp(params.search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { subject: searchRegex },
        { course: searchRegex },
        { tags: searchRegex }
      ];
      console.log('Search filter applied:', params.search);
    }

    // Status filter (for restricted/unrestricted)
    if (params.status && params.status !== 'all') {
      if (params.status === 'restricted') {
        filter.isRestricted = true;
      } else if (params.status === 'unrestricted') {
        filter.isRestricted = false;
      }
      console.log('Status filter applied:', params.status);
    }

    // Date range filtering
    if (params.dateRange && params.dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      let endDate: Date;

      switch (params.dateRange) {
        case 'last_week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'last_month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'last_3_months':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'custom':
          if (params.startDate && params.endDate) {
            startDate = new Date(params.startDate);
            endDate = new Date(params.endDate);
            // Set end date to end of day
            endDate.setHours(23, 59, 59, 999);
          } else {
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            endDate = now;
          }
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          endDate = now;
      }

      filter.uploadedAt = {
        $gte: startDate,
        $lte: endDate
      };
      console.log('Date range filter applied:', params.dateRange, 'from', startDate, 'to', endDate);
    }

    console.log('Final filter object:', filter);
    console.log('=== GetMaterialsUseCase DEBUG END ===');

    const skip = (params.page - 1) * params.limit;
    const sort = { uploadedAt: -1 };
    const materials = await this.repo.find(filter, { skip, limit: params.limit, sort });
    const total = await this.repo.count(filter);
    const totalPages = Math.ceil(total / params.limit);
    
    console.log('Query results:', {
      materialsFound: materials.length,
      total,
      totalPages,
      page: params.page,
      limit: params.limit
    });
    
    return {
      materials: materials.map(toMaterialProps),
      totalPages,
    };
  }
}

export class GetMaterialByIdUseCase {
  constructor(private repo: IMaterialsRepository) {}
  async execute(params: GetMaterialByIdRequestDTO): Promise<GetMaterialByIdResponseDTO | null> {
    if (!params.id) throw new MaterialValidationError('Material ID is required');
    const material = await this.repo.findById(params.id);
    if (!material) throw new MaterialNotFoundError(params.id);
    return { material: toMaterialProps(material) };
  }
}

export class CreateMaterialUseCase {
  constructor(private repo: IMaterialsRepository) {}
  async execute(params: CreateMaterialRequestDTO): Promise<CreateMaterialResponseDTO> {
    // Business logic/validation
    const material = Material.create(params);
    const dbResult = await this.repo.create(material.props);
    return { material: toMaterialProps(dbResult) };
  }
}

export class UpdateMaterialUseCase {
  constructor(private repo: IMaterialsRepository) {}
  async execute(params: UpdateMaterialRequestDTO): Promise<UpdateMaterialResponseDTO | null> {
    if (!params.id) throw new MaterialValidationError('Material ID is required');
    
    // First, get the existing material
    const existingMaterial = await this.repo.findById(params.id);
    if (!existingMaterial) throw new MaterialNotFoundError(params.id);
    
    // Create updated material using the entity's update method
    const existingProps = toMaterialProps(existingMaterial);
    console.log('=== UPDATE MATERIAL USE CASE DEBUG ===');
    console.log('Existing props:', existingProps);
    console.log('Update params:', params);
    
    // Create updated material using the entity's update method
    const { id, ...updateData } = params;
    const updatedMaterial = Material.update(existingProps, updateData);
    console.log('Updated material props:', updatedMaterial.props);
    console.log('=== UPDATE MATERIAL USE CASE DEBUG END ===');
    
    // Update in database
    const dbResult = await this.repo.update(params.id, updatedMaterial.props);
    if (!dbResult) throw new MaterialNotFoundError(params.id);
    
    return { material: toMaterialProps(dbResult) };
  }
}

export class DeleteMaterialUseCase {
  constructor(private repo: IMaterialsRepository) {}
  async execute(params: DeleteMaterialRequestDTO): Promise<void> {
    if (!params.id) throw new MaterialValidationError('Material ID is required');
    const material = await this.repo.findById(params.id);
    if (!material) throw new MaterialNotFoundError(params.id);
    await this.repo.delete(params.id);
  }
} 