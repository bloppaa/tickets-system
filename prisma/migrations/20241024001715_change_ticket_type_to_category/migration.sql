/*
  Warnings:

  - You are about to drop the column `type` on the `ticket` table. All the data in the column will be lost.
  - Added the required column `category` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticket` DROP COLUMN `type`,
    ADD COLUMN `category` INTEGER NOT NULL;
