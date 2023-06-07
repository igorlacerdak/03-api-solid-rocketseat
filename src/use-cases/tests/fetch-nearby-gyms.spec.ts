import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('Should to able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'Academia de Java Script',
      latitude: -19.5840119,
      longitude: -46.95137,
      phone: '',
    });

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'Academia de Typescript',
      latitude: -27.0610928,
      longitude: -49.5229501,
      phone: '',
    });

    const { gyms } = await sut.execute({
      userLatitude: -19.5840119,
      userLongitude: -46.95137,
    });

    expect(gyms).toHaveLength(1);

    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
  });
});
