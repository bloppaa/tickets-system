/*
  Warnings:

  - You are about to drop the column `category` on the `ticket` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `ticket` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(0))`.
  - You are about to alter the column `priority` on the `ticket` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(2))`.
  - You are about to drop the `client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ticket` DROP FOREIGN KEY `Ticket_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `ticket` DROP FOREIGN KEY `Ticket_userId_fkey`;

-- AlterTable
ALTER TABLE `ticket` DROP COLUMN `category`,
    ADD COLUMN `type` ENUM('Hardware', 'Software', 'Other') NOT NULL,
    MODIFY `status` ENUM('Open', 'InProgress', 'Closed') NOT NULL DEFAULT 'Open',
    MODIFY `priority` ENUM('Low', 'Medium', 'High') NOT NULL;

-- DropTable
DROP TABLE `client`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Person` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `rut` VARCHAR(191) NOT NULL,
    `password` CHAR(60) NOT NULL,
    `isClient` BOOLEAN NOT NULL,
    `companyRut` VARCHAR(191) NULL,

    UNIQUE INDEX `Person_email_key`(`email`),
    UNIQUE INDEX `Person_rut_key`(`rut`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Person`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
