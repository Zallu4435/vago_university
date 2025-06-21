import {
  GetSiteSectionsRequestDTO,
  GetSiteSectionByIdRequestDTO,
  CreateSiteSectionRequestDTO,
  UpdateSiteSectionRequestDTO,
  DeleteSiteSectionRequestDTO,
} from "../../../domain/site-management/dtos/SiteSectionDTOs";
import {
  GetSiteSectionsResponseDTO,
  GetSiteSectionByIdResponseDTO,
  CreateSiteSectionResponseDTO,
  UpdateSiteSectionResponseDTO,
} from "../../../domain/site-management/dtos/SiteSectionDTOs";
import { ISiteSectionRepository } from "../repositories/ISiteSectionRepository";


interface ResponseDTO<T> {
  data: T | { error: string };
  success: boolean;
}

export interface IGetSiteSectionsUseCase {
  execute(params: GetSiteSectionsRequestDTO): Promise<{ success: boolean; data: GetSiteSectionsResponseDTO }>;
}

export interface IGetSiteSectionByIdUseCase {
  execute(params: GetSiteSectionByIdRequestDTO): Promise<{ success: boolean; data: GetSiteSectionByIdResponseDTO | null }>;
}

export interface ICreateSiteSectionUseCase {
  execute(params: CreateSiteSectionRequestDTO): Promise<{ success: boolean; data: CreateSiteSectionResponseDTO }>;
}

export interface IUpdateSiteSectionUseCase {
  execute(params: UpdateSiteSectionRequestDTO): Promise<{ success: boolean; data: UpdateSiteSectionResponseDTO | null }>;
}

export interface IDeleteSiteSectionUseCase {
  execute(params: DeleteSiteSectionRequestDTO): Promise<{ success: boolean; data: void }>;
}

export class GetSiteSectionsUseCase implements IGetSiteSectionsUseCase {
  constructor(private readonly siteSectionRepository: ISiteSectionRepository) {}

  async execute(params: GetSiteSectionsRequestDTO): Promise<{ success: boolean; data: GetSiteSectionsResponseDTO }> {
    try {
      const data = await this.siteSectionRepository.getSections(params);
      return { success: true, data };
    } catch (error) {
      return { success: false, data: null as any };
    }
  }
}

export class GetSiteSectionByIdUseCase implements IGetSiteSectionByIdUseCase {
  constructor(private readonly siteSectionRepository: ISiteSectionRepository) {}

  async execute(params: GetSiteSectionByIdRequestDTO): Promise<{ success: boolean; data: GetSiteSectionByIdResponseDTO | null }> {
    try {
      const data = await this.siteSectionRepository.getSectionById(params);
      return { success: true, data };
    } catch (error) {
      return { success: false, data: null };
    }
  }
}

export class CreateSiteSectionUseCase implements ICreateSiteSectionUseCase {
  constructor(private readonly siteSectionRepository: ISiteSectionRepository) {}

  async execute(params: CreateSiteSectionRequestDTO): Promise<{ success: boolean; data: CreateSiteSectionResponseDTO }> {
    try {
      const data = await this.siteSectionRepository.createSection(params);
      return { success: true, data };
    } catch (error) {
      return { success: false, data: null as any };
    }
  }
}

export class UpdateSiteSectionUseCase implements IUpdateSiteSectionUseCase {
  constructor(private readonly siteSectionRepository: ISiteSectionRepository) {}

  async execute(params: UpdateSiteSectionRequestDTO): Promise<{ success: boolean; data: UpdateSiteSectionResponseDTO | null }> {
    try {
      const data = await this.siteSectionRepository.updateSection(params);
      return { success: true, data };
    } catch (error) {
      return { success: false, data: null };
    }
  }
}

export class DeleteSiteSectionUseCase implements IDeleteSiteSectionUseCase {
  constructor(private readonly siteSectionRepository: ISiteSectionRepository) {}

  async execute(params: DeleteSiteSectionRequestDTO): Promise<{ success: boolean; data: void }> {
    try {
      await this.siteSectionRepository.deleteSection(params);
      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, data: undefined };
    }
  }
} 