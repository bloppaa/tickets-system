/*
  Warnings:

  - You are about to drop the column `personRut` on the `ticket` table. All the data in the column will be lost.
  - Added the required column `personId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ticket` DROP FOREIGN KEY `Ticket_personRut_fkey`;

-- AlterTable
ALTER TABLE `ticket` DROP COLUMN `personRut`,
    ADD COLUMN `personId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
