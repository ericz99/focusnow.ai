/*
  Warnings:

  - The values [interviewer,interviewee,copilot] on the enum `Transcript_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `transcript` MODIFY `type` ENUM('user', 'assistant') NOT NULL;
