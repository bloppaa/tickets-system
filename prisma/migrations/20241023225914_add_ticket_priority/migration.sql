/*
  Warnings:

  - Added the required column `priority` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `priority` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL;
