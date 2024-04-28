/*
  Warnings:

  - You are about to drop the column `assistantId` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `folderId` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `assistantChatHistoryId` on the `request` table. All the data in the column will be lost.
  - You are about to drop the `assistant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `assistantchathistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `folder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teammember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teammemberonroles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creditId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `assistant` DROP FOREIGN KEY `Assistant_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `assistantchathistory` DROP FOREIGN KEY `AssistantChatHistory_assistantId_fkey`;

-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_assistantId_fkey`;

-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_folderId_fkey`;

-- DropForeignKey
ALTER TABLE `folder` DROP FOREIGN KEY `Folder_assistantId_fkey`;

-- DropForeignKey
ALTER TABLE `invite` DROP FOREIGN KEY `Invite_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `request` DROP FOREIGN KEY `Request_assistantChatHistoryId_fkey`;

-- DropForeignKey
ALTER TABLE `team` DROP FOREIGN KEY `Team_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `teammember` DROP FOREIGN KEY `TeamMember_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `teammember` DROP FOREIGN KEY `TeamMember_userId_fkey`;

-- DropForeignKey
ALTER TABLE `teammemberonroles` DROP FOREIGN KEY `TeamMemberOnRoles_teamMemberId_fkey`;

-- AlterTable
ALTER TABLE `document` DROP COLUMN `assistantId`,
    DROP COLUMN `folderId`,
    ADD COLUMN `type` ENUM('resume', 'cover_letter') NOT NULL;

-- AlterTable
ALTER TABLE `request` DROP COLUMN `assistantChatHistoryId`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `creditId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `assistant`;

-- DropTable
DROP TABLE `assistantchathistory`;

-- DropTable
DROP TABLE `folder`;

-- DropTable
DROP TABLE `invite`;

-- DropTable
DROP TABLE `team`;

-- DropTable
DROP TABLE `teammember`;

-- DropTable
DROP TABLE `teammemberonroles`;

-- CreateTable
CREATE TABLE `Credit` (
    `id` VARCHAR(191) NOT NULL,
    `creditRemaining` INTEGER NOT NULL DEFAULT 0,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Credit_userId_key`(`userId`),
    INDEX `Credit_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isFinished` BOOLEAN NOT NULL DEFAULT false,
    `totalTime` VARCHAR(191) NOT NULL,
    `finishedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transcript` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('interviewer', 'interviewee', 'copilot') NOT NULL,
    `content` LONGTEXT NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `metadatas` JSON NULL,
    `commands` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Transcript_sessionId_idx`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Credit` ADD CONSTRAINT `Credit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transcript` ADD CONSTRAINT `Transcript_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Session`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
