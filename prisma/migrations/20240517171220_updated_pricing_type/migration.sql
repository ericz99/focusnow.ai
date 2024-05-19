/*
  Warnings:

  - You are about to alter the column `type` on the `price` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `price` MODIFY `type` ENUM('one_time', 'recurring') NOT NULL DEFAULT 'recurring';
