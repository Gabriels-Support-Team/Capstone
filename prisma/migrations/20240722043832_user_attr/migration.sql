/*
  Warnings:

  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupation` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable

ALTER TABLE "User" ADD COLUMN "gender" VARCHAR(255) DEFAULT 'M';
ALTER TABLE "User" ADD COLUMN "occupation" INTEGER DEFAULT 0;
