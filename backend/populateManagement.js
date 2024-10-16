const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const centres = ['Indira Nagar', 'HSR Layout', 'Electronic City', 'Whitefield', 'RT Nagar', 'Bagalur', 'Kaggadasapura'];

  for (const centreName of centres) {
    const centre = await prisma.centre.findFirst({
      where: {
        name: centreName
      }
    });

    if (!centre) {
      console.log(`Centre ${centreName} not found in the database. Skipping.`);
      continue;
    }

    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 10);

    const manager = await prisma.manager.create({
      data: {
        name: `Manager ${centreName}`,
        email: `${centreName.toLowerCase().replace(/ /g, '')}@gmail.com`,
        password: hashedPassword,
        centreId: centre.centreId
      }
    });

    console.log(`Manager for ${centreName} created with hashed password.`);
  }

  console.log('Manager population completed.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });