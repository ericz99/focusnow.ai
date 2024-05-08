/*
  Warnings:

  - A unique constraint covering the columns `[resumeId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[coverLetterId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resumeId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `document` ADD COLUMN `isPrimary` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `session` ADD COLUMN `additionalInfo` LONGTEXT NULL,
    ADD COLUMN `coverLetterId` VARCHAR(191) NULL,
    ADD COLUMN `resumeId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Session_resumeId_key` ON `Session`(`resumeId`);

-- CreateIndex
CREATE UNIQUE INDEX `Session_coverLetterId_key` ON `Session`(`coverLetterId`);
