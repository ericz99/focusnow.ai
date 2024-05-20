/*
  Warnings:

  - You are about to drop the `credit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `credit` DROP FOREIGN KEY `Credit_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `credit` BIGINT NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `credit`;
