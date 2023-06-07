import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify();

  console.log(request.user.sub);

  return reply.status(200).send();
}
