/*
  Warnings:

  - You are about to drop the column `amount` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `isOptional` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `recipeId` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `substitute` on the `Ingredient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Ingredient` DROP FOREIGN KEY `Ingredient_recipeId_fkey`;

-- DropIndex
DROP INDEX `Ingredient_recipeId_idx` ON `Ingredient`;

-- AlterTable
ALTER TABLE `Ingredient` DROP COLUMN `amount`,
    DROP COLUMN `isOptional`,
    DROP COLUMN `recipeId`,
    DROP COLUMN `substitute`,
    ADD COLUMN `calories` DOUBLE NULL;

-- CreateTable
CREATE TABLE `IngredientsOnRecipes` (
    `recipeId` INTEGER NOT NULL,
    `ingredientId` INTEGER NOT NULL,
    `amount` VARCHAR(191) NULL,
    `unit` VARCHAR(191) NULL,
    `substitute` VARCHAR(191) NULL,
    `isOptional` BOOLEAN NOT NULL DEFAULT false,

    INDEX `IngredientsOnRecipes_recipeId_idx`(`recipeId`),
    INDEX `IngredientsOnRecipes_ingredientId_idx`(`ingredientId`),
    PRIMARY KEY (`recipeId`, `ingredientId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Ingredient_name_key` ON `Ingredient`(`name`);

-- AddForeignKey
ALTER TABLE `IngredientsOnRecipes` ADD CONSTRAINT `IngredientsOnRecipes_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IngredientsOnRecipes` ADD CONSTRAINT `IngredientsOnRecipes_ingredientId_fkey` FOREIGN KEY (`ingredientId`) REFERENCES `Ingredient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
