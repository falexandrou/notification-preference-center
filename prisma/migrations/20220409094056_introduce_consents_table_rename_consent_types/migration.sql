/*
  Warnings:

  - You are about to drop the column `consent` on the `Event` table. All the data in the column will be lost.
  - Added the required column `type` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Event` DROP COLUMN `consent`,
    ADD COLUMN `type` ENUM('email_notifications', 'sms_notifications') NOT NULL;

-- CreateTable
CREATE TABLE `Consent` (
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('email_notifications', 'sms_notifications') NOT NULL,
    `enabled` BOOLEAN NOT NULL,

    UNIQUE INDEX `Consent_userId_type_key`(`userId`, `type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Consent` ADD CONSTRAINT `Consent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
