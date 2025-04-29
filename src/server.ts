import Fastify from 'fastify';
import bookRoutes from './routes/books';

const fastify = Fastify({ logger: true });

fastify.register(bookRoutes);

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 The server is running on ${address}`);
});
