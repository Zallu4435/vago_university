export interface IBaseRepository<
  T,
  CreateDto = unknown,
  UpdateDto = unknown,
  FilterDto = Record<string, unknown>,
  ResponseType = T
> {
  create(data: CreateDto): Promise<T>;
  getById(id: string): Promise<ResponseType | null>;
  find(filter: FilterDto, page?: number, limit?: number): Promise<{
    data: ResponseType[];
    total: number;
    page: number;
    limit: number;
  }>;
  findOne(filter: FilterDto): Promise<ResponseType | null>;
  updateById(id: string, data: UpdateDto): Promise<ResponseType | null>;
  deleteById(id: string): Promise<ResponseType | null>;
  count(filter?: FilterDto): Promise<number>;
  exists(filter: FilterDto): Promise<boolean>;
}
