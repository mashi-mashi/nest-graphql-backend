import { Injectable } from '@nestjs/common';
import { Article, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async findById(
    input: Prisma.ArticleWhereUniqueInput,
  ): Promise<Article | null> {
    return this.prisma.article.findUnique({ where: input });
  }
}
