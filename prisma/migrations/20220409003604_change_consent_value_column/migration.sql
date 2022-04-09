/*
  Warnings:

  - You are about to drop the column `value` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Event` DROP COLUMN `value`,
    ADD COLUMN `enabled` BOOLEAN NOT NULL DEFAULT true;
