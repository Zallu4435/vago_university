import { FilterQuery, UpdateQuery } from 'mongoose';
import { IBaseRepository } from '../../application/repositories/IBaseRepository';

export abstract class BaseRepository<
  TSchema,
  CreateDto = unknown,
  UpdateDto = unknown,
  FilterDto = Record<string, unknown>,
  ResponseType = TSchema
> implements IBaseRepository<ResponseType, CreateDto, UpdateDto, FilterDto, ResponseType> {

  constructor(protected model: any) {} 

  async create(data: CreateDto): Promise<ResponseType> {
    const entity = new this.model(data);
    return await entity.save() as ResponseType;
  }

  async getById(id: string): Promise<ResponseType | null> {
    return this.model.findById(id).lean().exec() as Promise<ResponseType | null>;
  }

  async find(filter: FilterDto, page = 1, limit = 10): Promise<{
    data: ResponseType[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.find(filter as FilterQuery<TSchema>).skip(skip).limit(limit).lean().exec(),
      this.model.countDocuments(filter as FilterQuery<TSchema>)
    ]);

    return { data: data as ResponseType[], total, page, limit };
  }

  async findOne(filter: FilterDto): Promise<ResponseType | null> {
    return this.model.findOne(filter as FilterQuery<TSchema>).lean().exec() as Promise<ResponseType | null>;
  }

  async updateById(id: string, data: UpdateDto): Promise<ResponseType | null> {
    return this.model.findByIdAndUpdate(
      id,
      data as UpdateQuery<TSchema>,
      { new: true, runValidators: true }
    ).lean().exec() as Promise<ResponseType | null>;
  }

  async deleteById(id: string): Promise<ResponseType | null> {
    return this.model.findByIdAndDelete(id).lean().exec() as Promise<ResponseType | null>;
  }

  async count(filter?: FilterDto): Promise<number> {
    return this.model.countDocuments((filter as FilterQuery<TSchema>) || {}).exec();
  }

  async exists(filter: FilterDto): Promise<boolean> {
    const count = await this.model.countDocuments(filter as FilterQuery<TSchema>);
    return count > 0;
  }
}
