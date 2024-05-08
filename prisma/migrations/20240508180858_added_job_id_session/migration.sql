/*
  Warnings:

  - A unique constraint covering the columns `[jobId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jobId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `session` ADD COLUMN `jobId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Session_jobId_key` ON `Session`(`jobId`);
