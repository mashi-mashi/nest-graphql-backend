-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_providerId_fkey";

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
