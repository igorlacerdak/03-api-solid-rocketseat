import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { expect, describe, it, beforeEach } from 'vitest';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('Should to able to create a Gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: 'Academia do Java Script',
      phone: null,
      latitude: -19.5840119,
      longitude: -46.95137,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
