import { IMaterialsRepository } from '../../../application/materials/repositories/IMaterialsRepository';
import { MaterialModel } from '../../database/mongoose/material/MaterialModel';

export class MaterialsRepository implements IMaterialsRepository {
  async find(filter: any, options: { skip?: number; limit?: number; sort?: any } = {}): Promise<any[]> {
    return MaterialModel.find(filter)
      .sort(options.sort ?? {})
      .skip(options.skip ?? 0)
      .limit(options.limit ?? 0);
  }

  async count(filter: any): Promise<number> {
    return MaterialModel.countDocuments(filter);
  }

  async findById(id: string): Promise<any | null> {
    return MaterialModel.findById(id);
  }

  async create(data: any): Promise<any> {
    console.log('=== MATERIAL REPOSITORY CREATE DEBUG ===');
    console.log('Creating material with data:', data);
    console.log('=== MATERIAL REPOSITORY CREATE DEBUG END ===');
    
    const material = new MaterialModel(data);
    await material.save();
    return material;
  }

  async update(id: string, data: any): Promise<any | null> {
    console.log('=== MATERIAL REPOSITORY UPDATE DEBUG ===');
    console.log('Updating material with id:', id);
    console.log('Update data:', data);
    console.log('=== MATERIAL REPOSITORY UPDATE DEBUG END ===');
    
    return MaterialModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await MaterialModel.findByIdAndDelete(id);
  }
} 