import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare, hash } from 'bcryptjs';
import { expect, describe, it, beforeEach } from 'vitest';
import { AuthenticateUseCase } from '../authenticate';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('Should to able to autheticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('Should not be able to autheticate with wrong email', async () => {
    expect(
      async () =>
        await sut.execute({
          email: 'johndoe@example.com',
          password: '123456',
        }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('Should not be able to autheticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    });

    expect(
      async () =>
        await sut.execute({
          email: 'johndoe@example.com',
          password: '22156',
        }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
