/*
  Warnings:

  - You are about to drop the column `SEO_KEYWORDS` on the `Blog` table. All the data in the column will be lost.
  - Added the required column `content` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "SEO_KEYWORDS",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "seoKeywords" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "photo" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Blog_userId_idx" ON "Blog"("userId");
