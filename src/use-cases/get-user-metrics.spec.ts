import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { expect, describe, it, beforeEach } from 'vitest';
import { GetUserMetricsUseCase } from './get-user-metrics';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe('Get User Metrics UseCase', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it('Should to able to get check-ins counts from metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'igorlacerdasantos',
    });

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'igorlacerdasantos',
    });

    const { checkInsCount } = await sut.execute({
      userId: 'igorlacerdasantos',
      page: 1,
    });

    expect(checkInsCount).toEqual(2);
  });
});
