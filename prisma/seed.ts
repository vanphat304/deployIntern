import { PrismaClient } from '@prisma/client';
import { district, provinces , specializeCompany } from './data.seed';
const prisma = new PrismaClient();

function seedDistrict() {
  Promise.all(
    district.map(({ name, code }) =>
      prisma.district.create({
        data: {
          name,
          code,
        },
      }),
    ),
  )
    .then(() => console.info('[SEED] Succussfully create district records'))
    .catch((e) => console.error('[SEED] Failed to create district records', e));
}
function seedProvinces() {
  Promise.all(
    provinces.map(({ name, code }) =>
      prisma.province.create({
        data: {
          name,
          code,
        },
      }),
    ),
  )
    .then(() => console.info('[SEED] Succussfully create provinces records'))
    .catch((e) => console.error('[SEED] Failed to create provinces records', e));
}

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
seedDistrict();
seedProvinces();
seedSpecializeCompany();
