import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.specialities.createMany({
    data: [
      { name: 'Cardiologia' },
      { name: 'Dermatologia' },
      { name: 'Ortopedia' },
      { name: 'Pediatria' },
      { name: 'Neurologia' },
    ],
  });

  console.log('Specialities seeded!');

  // Busca especialidades existentes pelo nome
  const cardiologia = await prisma.specialities.findFirst({
    where: { name: 'Cardiologia' },
  });
  const dermatologia = await prisma.specialities.findFirst({
    where: { name: 'Dermatologia' },
  });
  const ortopedia = await prisma.specialities.findFirst({
    where: { name: 'Ortopedia' },
  });
  const pediatria = await prisma.specialities.findFirst({
    where: { name: 'Pediatria' },
  });
  const neurologia = await prisma.specialities.findFirst({
    where: { name: 'Neurologia' },
  });

  // Verificação defensiva
  if (
    !cardiologia ||
    !dermatologia ||
    !ortopedia ||
    !pediatria ||
    !neurologia
  ) {
    throw new Error(
      'Uma ou mais especialidades não foram encontradas. Execute primeiro a seed de Specialities.',
    );
  }

  // Cria médicos relacionados a especialidades
  await prisma.doctors.createMany({
    data: [
      { name: 'Dr. João Silva', speciality_id: cardiologia.id },
      { name: 'Dra. Maria Souza', speciality_id: dermatologia.id },
      { name: 'Dr. Paulo Oliveira', speciality_id: ortopedia.id },
      { name: 'Dra. Ana Lima', speciality_id: pediatria.id },
      { name: 'Dr. Ricardo Mendes', speciality_id: neurologia.id },
    ],
  });

  console.log('Doctors seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
