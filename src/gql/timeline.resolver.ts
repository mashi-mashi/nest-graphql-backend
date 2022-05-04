import { Injectable, NotFoundException } from '@nestjs/common';
import { Args, Field, ObjectType, Query } from '@nestjs/graphql';
import { DateTime } from 'luxon';
import { PrismaService } from 'src/common/prisma.service';
import { CustomLogger } from 'src/util/logger';

@ObjectType()
export class TimelineDotGQLModel {
  @Field(() => String)
  id: string;

  @Field()
  timelineId: string;

  @Field(() => String)
  title: string;

  @Field()
  description: string;

  @Field()
  date: string;

  @Field({ nullable: true })
  createdAt: number;
  @Field({ nullable: true })
  updatedAt: number;
}

@ObjectType()
export class TimelineGQLModel {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  createdAt: number;
  @Field({ nullable: true })
  updatedAt: number;

  @Field(() => [TimelineDotGQLModel], { nullable: true })
  dots: TimelineDotGQLModel[];
}

@Injectable()
export class TimelineResolver {
  private readonly logger = new CustomLogger(TimelineResolver.name);
  constructor(private prisma: PrismaService) {}

  @Query(() => TimelineGQLModel)
  async timeline(@Args('id') id: string) {
    const timeline = await this.prisma.timeline.findUnique({
      where: { id },
      include: {
        dots: true,
      },
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
      dots: timeline.dots.map((dot) => ({
        id: dot.id,
        timelineId: dot.timelineId,
        title: dot.title,
        description: dot.description,
        date: DateTime.fromJSDate(dot.date).toFormat('yyyy-MM-dd'),
        createdAt: dot.createdAt.valueOf(),
        updatedAt: dot.updatedAt.valueOf(),
      })),
    };
  }

  @Query(() => [TimelineGQLModel])
  async timelines() {
    const timelines = await this.prisma.timeline.findMany({
      include: {
        dots: true,
      },
    });

    return timelines.map((timeline) => ({
      id: timeline.id,
      title: timeline.title,
      status: timeline.status,
      createdAt: timeline.createdAt.valueOf(),
      updatedAt: timeline.updatedAt.valueOf(),

      dots: timeline.dots.map((dot) => ({
        id: dot.id,
        timelineId: dot.timelineId,
        title: dot.title,
        description: dot.description,
        date: dot.date.toLocaleDateString(),
        createdAt: dot.createdAt.valueOf(),
        updatedAt: dot.updatedAt.valueOf(),
      })),
    }));
  }
}
