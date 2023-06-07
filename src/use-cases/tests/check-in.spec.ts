import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { CheckInUseCase } from './../check-in';
import { MaxDistanceError } from './../errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './../errors/max-number-of-check-ins-error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Academia JS',
      description: 'Academia de Java Script',
      latitude: -19.5840119,
      longitude: -46.95137,
      phone: '',
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Should to able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -19.5840119,
      userLongitude: -46.95137,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('Should not be able check ins twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -19.5840119,
      userLongitude: -46.95137,
    });

    await expect(async () => {
      await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -19.5840119,
        userLongitude: -46.95137,
      });
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('Should be able check ins twice but diference', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -19.5840119,
      userLongitude: -46.95137,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -19.5840119,
      userLongitude: -46.95137,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('Should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Academia C#',
      description: 'Academia de CSharp',
      latitude: new Decimal(-19.56686),
      longitude: new Decimal(-46.9334769),
      phone: '',
    });

    await expect(async () => {
      await sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -19.5840119,
        userLongitude: -46.95137,
      });
    }).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
