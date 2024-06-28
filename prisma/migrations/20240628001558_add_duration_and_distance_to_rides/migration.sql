/*
  Warnings:

  - Added the required column `distance` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "distance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "duration" DOUBLE PRECISION NOT NULL;
