import { GymsRepository } from '@/repositories/interface/gyms-repository';
import { UsersRepository } from '@/repositories/interface/users-repository';
import { Gym, User } from '@prisma/client';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface CreateGymUseCaseRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymUseCaseResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    description,
    latitude,
    longitude,
    phone,
    title,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      description,
      latitude,
      longitude,
      phone,
      title,
    });

    return { gym };
  }
}
