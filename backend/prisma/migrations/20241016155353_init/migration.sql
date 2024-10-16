-- CreateEnum
CREATE TYPE "Sports" AS ENUM ('BADMINTON', 'SWIMMING', 'TABLE_TENNIS', 'CRICKET', 'FOOTBALL');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'MANAGER');

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "mobileNumber" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Manager" (
    "managerId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MANAGER',
    "centreId" INTEGER NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("managerId")
);

-- CreateTable
CREATE TABLE "Centre" (
    "centreId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Centre_pkey" PRIMARY KEY ("centreId")
);

-- CreateTable
CREATE TABLE "Court" (
    "courtId" SERIAL NOT NULL,
    "centreId" INTEGER NOT NULL,
    "sport" "Sports" NOT NULL,
    "courtNumber" INTEGER NOT NULL,

    CONSTRAINT "Court_pkey" PRIMARY KEY ("courtId")
);

-- CreateTable
CREATE TABLE "Slot" (
    "slotId" SERIAL NOT NULL,
    "courtId" INTEGER NOT NULL,
    "isOccupied" BOOLEAN NOT NULL DEFAULT false,
    "time" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("slotId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_email_key" ON "Manager"("email");

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_centreId_fkey" FOREIGN KEY ("centreId") REFERENCES "Centre"("centreId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Court" ADD CONSTRAINT "Court_centreId_fkey" FOREIGN KEY ("centreId") REFERENCES "Centre"("centreId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court"("courtId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
