/*
  Warnings:

  - You are about to drop the column `personId` on the `ticket` table. All the data in the column will be lost.
  - Added the required column `personRut` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ticket` DROP FOREIGN KEY `Ticket_personId_fkey`;

-- AlterTable
ALTER TABLE `ticket` DROP COLUMN `personId`,
    ADD COLUMN `personRut` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_personRut_fkey` FOREIGN KEY (`personRut`) REFERENCES `Person`(`rut`) ON DELETE RESTRICT ON UPDATE CASCADE;
