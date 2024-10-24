/*
  Warnings:

  - You are about to alter the column `status` on the `ticket` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Int`.
  - You are about to alter the column `priority` on the `ticket` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Int`.
  - Added the required column `type` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `type` INTEGER NOT NULL,
    MODIFY `status` INTEGER NOT NULL DEFAULT 0,
    MODIFY `priority` INTEGER NOT NULL;
