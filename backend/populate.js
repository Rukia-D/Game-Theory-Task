const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const centres = ['Indira Nagar', 'HSR Layout', 'Electronic City', 'Whitefield', 'RT Nagar', 'Bagalur', 'Kaggadasapura'];
    const sports = ['BADMINTON', 'SWIMMING', 'CRICKET', 'TABLE_TENNIS', 'FOOTBALL']; // Use enum values

    for (const centreName of centres) {
        const centre = await prisma.centre.create({
        data: {
            name: centreName,
            location: `${centreName}, Bangalore`
        }
        });

        for (const sportName of sports) {
        const numberOfCourts = Math.floor(Math.random() * 3) + 1;
        for (let i = 1; i <= numberOfCourts; i++) {
            await prisma.court.create({
            data: {
                courtNumber: i,
                centreId: centre.centreId,
                sport: sportName
            }
            });
        }

        console.log(`Created ${numberOfCourts} courts for ${sportName} at ${centreName}`);
        }
    }

    console.log('Database has been populated successfully.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
});