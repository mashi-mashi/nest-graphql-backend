import { Injectable, NotFoundException } from '@nestjs/common';
import { Args, Field, ObjectType, Query } from '@nestjs/graphql';
import { PrismaService } from 'src/common/prisma.service';
import { CustomLogger } from 'src/util/logger';

@ObjectType()
export class TimelineGQLModel {
  @Field((type) => String)
  id: string;

  @Field((type) => String)
  title: string;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  createdAt: number;
  @Field({ nullable: true })
  updatedAt: number;
}

@Injectable()
export class TimelineResolver {
  private readonly logger = new CustomLogger(TimelineResolver.name);
  constructor(private prisma: PrismaService) {}

  @Query(() => TimelineGQLModel)
  async timeline(@Args('id') id: string) {
    const timeline = await this.prisma.timeline.findUnique({
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

  @Query(() => [TimelineGQLModel])
  async timelines() {
    console.log('!!!!!!!!!', this.prisma);
    const timelines = await this.prisma.timeline.findMany().catch((err) => {
      console.error('e', err);
      return [];
    });

    console.log('timelines', timelines);

    return timelines.map((timeline) => ({
      id: timeline.id,
      title: timeline.title,
      status: timeline.status,
      createdAt: timeline.createdAt.valueOf(),
      updatedAt: timeline.updatedAt.valueOf(),
    }));
  }
}
