/*
  Warnings:

  - A unique constraint covering the columns `[completedDriverId]` on the table `Ride` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ride_completedDriverId_key" ON "Ride"("completedDriverId");
