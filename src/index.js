const { PrismaClient } = require('@prisma/client')
require('dotenv').config({ path: ".env" });
prisma = new PrismaClient()
const http = require('http');

const app = require('./app');
const server = http.createServer(app)

async function start() {
  await prisma.$connect()
    .then(async () => {
      console.log('prisma DB connected')
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })

  server.listen({ port: process.env.PORT || 4000 }, function (err) {
    if (err) {
      console.log(err)
      process.exit(1)
    }
    console.log(`🚀 Server ready at: http://localhost:` + (process.env.PORT || 4000))
  })
}
start();
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});