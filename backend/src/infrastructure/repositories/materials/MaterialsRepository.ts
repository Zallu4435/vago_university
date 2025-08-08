import { IMaterialsRepository } from '../../../application/materials/repositories/IMaterialsRepository';
import { MaterialModel } from '../../database/mongoose/material/MaterialModel';

export class MaterialsRepository implements IMaterialsRepository {
  async find(filter, options: { skip?: number; limit?: number; sort? } = {}) {
    return MaterialModel.find(filter)
      .sort(options.sort ?? {})
      .skip(options.skip ?? 0)
      .limit(options.limit ?? 0);
  }

  async count(filter): Promise<number> {
    return MaterialModel.countDocuments(filter);
  }

  async findById(id: string) {
    return MaterialModel.findById(id);
  }

  async create(data) {
    const material = new MaterialModel(data);
    await material.save();
    return material;
  }

  async update(id: string, data) {
    return MaterialModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await MaterialModel.findByIdAndDelete(id);
  }
} 