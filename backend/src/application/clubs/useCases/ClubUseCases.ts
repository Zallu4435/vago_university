import {
  GetClubsRequestDTO,
  GetClubByIdRequestDTO,
  CreateClubRequestDTO,
  UpdateClubRequestDTO,
  DeleteClubRequestDTO,
} from "../../../domain/clubs/dtos/ClubRequestDTOs";
import {
  GetClubsResponseDTO,
  GetClubByIdResponseDTO,
  CreateClubResponseDTO,
  UpdateClubResponseDTO,
  ClubSummaryDTO,
} from "../../../domain/clubs/dtos/ClubResponseDTOs";
import { UpdateClubRequest } from "../../../domain/clubs/entities/Club";
import { IClubsRepository } from "../repositories/IClubsRepository";

export interface IGetClubsUseCase {
  execute(dto: GetClubsRequestDTO): Promise<GetClubsResponseDTO>;
}

export interface IGetClubByIdUseCase {
  execute(dto: GetClubByIdRequestDTO): Promise<GetClubByIdResponseDTO>;
}

export interface ICreateClubUseCase {
  execute(dto: CreateClubRequestDTO): Promise<CreateClubResponseDTO>;
}

export interface IUpdateClubUseCase {
  execute(dto: UpdateClubRequestDTO): Promise<UpdateClubResponseDTO>;
}

export interface IDeleteClubUseCase {
  execute(dto: DeleteClubRequestDTO): Promise<{ message: string }>;
}

function isValidObjectId(id: string): boolean {
  return typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);
}

export class GetClubsUseCase implements IGetClubsUseCase {
  constructor(private clubsRepository: IClubsRepository) { }

  async execute(dto: GetClubsRequestDTO): Promise<GetClubsResponseDTO> {
    if (isNaN(dto.page) || dto.page < 1 || isNaN(dto.limit) || dto.limit < 1) {
      throw new Error("Invalid page or limit parameters");
    }
    if (dto.startDate && isNaN(dto.startDate.getTime())) {
      throw new Error("Invalid startDate format");
    }
    if (dto.endDate && isNaN(dto.endDate.getTime())) {
      throw new Error("Invalid endDate format");
    }
    const { clubs, totalItems, totalPages, currentPage } = await this.clubsRepository.getClubs(dto);
    const mappedClubs: ClubSummaryDTO[] = clubs.map((club) => ({
      id: club._id.toString(),
      name: club.name,
      type: club.type,
      status: club.status,
      memberCount: club.enteredMembers || 0,
      icon: club.icon,
      createdAt: club.createdAt,
      createdBy: club.createdBy,
      color: club.color
    }));
    return {
      clubs: mappedClubs,
      totalItems,
      totalPages,
      currentPage,
    };
  }
}

export class GetClubByIdUseCase implements IGetClubByIdUseCase {
  constructor(private clubsRepository: IClubsRepository) { }

  async execute(dto: GetClubByIdRequestDTO): Promise<GetClubByIdResponseDTO> {
    if (!isValidObjectId(dto.id)) {
      throw new Error("Invalid club ID");
    }
    const club = await this.clubsRepository.getById(dto.id);
    if (!club) {
      throw new Error("Club not found!");
    }
    return { club };
  }
}

export class CreateClubUseCase implements ICreateClubUseCase {
  constructor(private clubsRepository: IClubsRepository) { }

  async execute(dto: CreateClubRequestDTO): Promise<CreateClubResponseDTO> {
    const newClub = await this.clubsRepository.create(dto);
    return {
      club: newClub
    };
  }
}

export class UpdateClubUseCase implements IUpdateClubUseCase {
  constructor(private clubsRepository: IClubsRepository) { }

  async execute(dto: UpdateClubRequestDTO): Promise<UpdateClubResponseDTO> {
    if (!isValidObjectId(dto.id)) {
      throw new Error("Invalid club ID");
    }
    const { id, ...updateData } = dto;
    const updatedClub = await this.clubsRepository.updateById(id, updateData as UpdateClubRequest);
    if (!updatedClub) {
      throw new Error("Club not found!");
    }
    return {
      club: updatedClub
    };
  }
}

export class DeleteClubUseCase implements IDeleteClubUseCase {
  constructor(private clubsRepository: IClubsRepository) { }

  async execute(dto: DeleteClubRequestDTO): Promise<{ message: string }> {
    if (!isValidObjectId(dto.id)) {
      throw new Error("Invalid club ID");
    }
    await this.clubsRepository.deleteById(dto.id);
    return { message: "Club deleted successfully" };
  }
}