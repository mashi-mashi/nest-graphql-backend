import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import {
  Args,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Prisma, Timeline as PrismaTimeline } from '@prisma/client';
import { DateTime } from 'luxon';
import { AuthGuard } from 'src/common/guards/app.guard';
import { PrismaService } from 'src/common/prisma.service';
import { DeepDateToMillis } from 'src/util/array-util';
import { TimelineService } from './timeline.service';

@ObjectType()
export class TimelineDot {
  @Field(() => String)
  id: string;

  @Field()
  timelineId: string;

  @Field(() => String)
  title: string;

  @Field()
  description: string;

  @Field()
  date: number;

  @Field({ nullable: true })
  createdAt: number;
  @Field({ nullable: true })
  updatedAt: number;
}

@ObjectType()
export class Timeline implements DeepDateToMillis<PrismaTimeline> {
  userId: string;

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

  @Field(() => [TimelineDot], { nullable: true })
  dots: TimelineDot[];
}

@InputType()
export class TimelineDotCreateInput {
  @Field(() => String)
  title: string;

  @Field()
  description: string;

  @Field({ description: 'format yyyy-MM-dd' })
  date: string;
}

@InputType()
export class TimelineDotUpdateInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field({ description: 'format yyyy-MM-dd', nullable: true })
  date?: string;
}

@InputType()
export class TimelineCreateInput {
  @Field(() => String)
  title: string;

  @Field({ nullable: true })
  status?: string;

  @Field(() => [TimelineDotCreateInput])
  dots: TimelineDotCreateInput[];
}

@InputType()
export class TimelineUpdateInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field({ nullable: true })
  status?: string;
}

@ObjectType()
export class GetTimelineResponse {
  @Field(() => [Timeline])
  timelines: Timeline[];

  @Field()
  totalCount: number;
}

@Injectable()
@UseGuards(AuthGuard)
@Resolver(() => Timeline)
export class TimelineResolver {
  constructor(
    private prisma: PrismaService,
    private timelineService: TimelineService,
  ) {}

  @Mutation(() => Timeline)
  async createTimeline(@Args('input') args: TimelineCreateInput) {
    return this.timelineService.create(args);
  }

  @Mutation(() => Timeline)
  async updateTimeline(
    @Args('id') id: string,
    @Args('input') args: TimelineUpdateInput,
  ) {
    return await this.prisma.timeline.update({
      where: { id },
      data: {
        ...args,
        status: args.status || 'private',
      },
    });
  }

  @Mutation(() => Timeline)
  async deleteTimeline(@Args('id') id: string) {
    return this.prisma.timeline.delete({
      where: {
        id,
      },
    });
  }

  @Mutation(() => TimelineDot)
  async updateTimelineDots(
    @Args('id') id: string,
    @Args('input') args: TimelineDotUpdateInput,
  ) {
    return this.prisma.timelineDots.update({
      where: {
        id,
      },
      data: {
        ...args,
        date: args.date
          ? DateTime.fromFormat(args.date, 'yyyy-MM-dd').toJSDate()
          : undefined,
      },
    });
  }

  @Query(() => Timeline)
  async getTimelineById(@Args('id') id: string) {
    const timeline = await this.prisma.timeline.findUnique({
      where: { id },
      include: {
        dots: true,
      },
    });
    if (!timeline) {
      throw new NotFoundException('Timeline not found');
    }

    return timeline;
  }

  @Query(() => GetTimelineResponse)
  async getTimelines() {
    const timelines = await this.prisma.timeline.findMany({
      include: {
        dots: true,
      },
    });

    return {
      timelines,
      totalCount: timelines.length,
    };
  }
}
