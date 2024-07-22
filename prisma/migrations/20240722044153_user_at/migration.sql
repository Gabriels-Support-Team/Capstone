/*
  Warnings:

  - Made the column `gender` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `occupation` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "gender" DROP DEFAULT,
ALTER COLUMN "gender" SET DATA TYPE TEXT,
ALTER COLUMN "occupation" SET NOT NULL,
ALTER COLUMN "occupation" DROP DEFAULT;
