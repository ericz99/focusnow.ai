/*
  Warnings:

  - You are about to drop the column `finishedAt` on the `session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `session` DROP COLUMN `finishedAt`,
    ADD COLUMN `endTime` INTEGER NULL,
    ADD COLUMN `startTime` INTEGER NULL;
