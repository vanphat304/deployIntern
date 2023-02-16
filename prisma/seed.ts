import { PrismaClient } from '@prisma/client';
import { district, provinces , specializeCompany } from './data.seed';
const prisma = new PrismaClient();


function seedSpecializeCompany() {
  Promise.all(
    specializeCompany.map(({ name }) =>
      prisma.specializeCompany.create({
        data: {
          name,
        },
      }),
    ),
  )
    .then(() => console.info('[SEED] Succussfully create specializeCompany records'))
    .catch((e) => console.error('[SEED] Failed to create specializeCompany records', e));
}
seedSpecializeCompany();
