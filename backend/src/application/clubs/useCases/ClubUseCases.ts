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
import { IClubsRepository } from "../repositories/IClubsRepository";
import mongoose from "mongoose";

export class GetClubsUseCase {
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
    const mappedClubs: ClubSummaryDTO[] = clubs.map((club: any) => ({
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

export class GetClubByIdUseCase {
  constructor(private clubsRepository: IClubsRepository) { }

  async execute(dto: GetClubByIdRequestDTO): Promise<GetClubByIdResponseDTO> {
    if (!mongoose.isValidObjectId(dto.id)) {
      throw new Error("Invalid club ID");
    }
    const club: any = await this.clubsRepository.getClubById(dto);
    if (!club) {
      throw new Error("Club not found!");
    }
    return {
      club: club
    };
  }
}

export class CreateClubUseCase {
  constructor(private clubsRepository: IClubsRepository) { }

  async execute(dto: CreateClubRequestDTO): Promise<CreateClubResponseDTO> {
    const newClub: any = await this.clubsRepository.createClub(dto);
    return {
      club: newClub
    };
  }
}

export class UpdateClubUseCase {
  constructor(private clubsRepository: IClubsRepository) { }

  async execute(dto: UpdateClubRequestDTO): Promise<UpdateClubResponseDTO> {
    if (!mongoose.isValidObjectId(dto.id)) {
      throw new Error("Invalid club ID");
    }
    const updatedClub: any = await this.clubsRepository.updateClub(dto);
    if (!updatedClub) {
      throw new Error("Club not found!");
    }
    return {
      club: updatedClub
    };
  }
}

export class DeleteClubUseCase {
  constructor(private clubsRepository: IClubsRepository) { }

  async execute(dto: DeleteClubRequestDTO): Promise<{ message: string }> {
    if (!mongoose.isValidObjectId(dto.id)) {
      throw new Error("Invalid club ID");
    }
    await this.clubsRepository.deleteClub(dto);
    return { message: "Club deleted successfully" };
  }
}