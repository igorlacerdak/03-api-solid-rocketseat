import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Should to able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'igorlacerdasantos',
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it('Should not be able to validate the check-in', async () => {
    expect(async () => {
      const { checkIn } = await sut.execute({
        checkInId: 'inexistent-check-in-id',
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('Should not to be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'igorlacerdasantos',
    });

    const twentyOneMinituesInMs = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyOneMinituesInMs);

    expect(
      async () =>
        await sut.execute({
          checkInId: createdCheckIn.id,
        }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
