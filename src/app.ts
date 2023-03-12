import fastify from 'fastify';
import { z, ZodError } from 'zod';
import { env } from './env';
import { register } from './http/controllers/register';
import { appRoutes } from './http/routes';
import { prisma } from './lib/prisma';

export const app = fastify();

app.register(appRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation Error.',
      issues: error.format(),
    });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
  }

  return reply.status(500).send({ message: 'Internal Server Error' });
});
