import { NotFoundException } from '@nestjs/common';
import { Args, Field, ObjectType, Query } from '@nestjs/graphql';
import { PrismaService } from 'src/common/prisma.service';

@ObjectType()
export class TimelineGQLModel {
  @Field((type) => String)
  id: string;

  @Field((type) => String)
  title: string;

  status: string;

  createdAt: number;
  updatedAt: number;
}
export class TimelineResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query(() => TimelineGQLModel)
  async findById(@Args('id') id: string) {
    const timeline = await this.prismaService.timeline.findUnique({
      where: { id },
    });

    if (!timeline) {
      throw new NotFoundException('Timeline not found');
    }

    return {
      id: timeline.id,
      title: timeline.title,
      status: timeline.status,
      createdAt: timeline.createdAt.valueOf(),
      updatedAt: timeline.updatedAt.valueOf(),
    };
  }
}
