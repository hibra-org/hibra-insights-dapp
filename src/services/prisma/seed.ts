import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const exchange = await prisma.exchange.createMany({
    data: [
      {
        id: 'binance',
        name: 'Binance',
      },
      {
        id: 'okx',
        name: 'OKX',
      },
    ],
  });
  // eslint-disable-next-line no-console
  console.log({ exchange });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
