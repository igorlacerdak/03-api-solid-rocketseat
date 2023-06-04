import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('Should to able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Javascript Gym',
      description: 'Academia de Java Script',
      latitude: -19.5840119,
      longitude: -46.95137,
      phone: '',
    });

    await gymsRepository.create({
      title: 'Typescript Gym',
      description: 'Academia de Typescript',
      latitude: -19.5840119,
      longitude: -46.95137,
      phone: '',
    });

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1,
    });

    expect(gyms).toHaveLength(1);

    expect(gyms).toEqual([expect.objectContaining({ title: 'Javascript Gym' })]);
  });

  it('Should to able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javascript Gym ${i}`,
        description: 'Academia de Java Script',
        latitude: -19.5840119,
        longitude: -46.95137,
        phone: '',
      });
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym 21' }),
      expect.objectContaining({ title: 'Javascript Gym 22' }),
    ]);
  });
});
