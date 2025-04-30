import Fastify from "fastify";
import bookRoutes from "./routes/books";
import authRoutes from "./routes/auth";
import authPlugin from './plugins/auth';

const fastify = Fastify({ logger: true });

fastify.register(authPlugin);

fastify.register(bookRoutes);
fastify.register(authRoutes);


fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 The server is running on ${address}`);
});
