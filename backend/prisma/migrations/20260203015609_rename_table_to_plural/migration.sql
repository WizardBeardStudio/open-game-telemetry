/*
  Warnings:

  - You are about to drop the `GameEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `GameEvent`;

-- CreateTable
CREATE TABLE `GameEvents` (
    `id` VARCHAR(191) NOT NULL,
    `gameName` VARCHAR(191) NOT NULL,
    `gameType` VARCHAR(191) NOT NULL,
    `gameVersion` VARCHAR(191) NOT NULL,
    `eventType` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `payload` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
