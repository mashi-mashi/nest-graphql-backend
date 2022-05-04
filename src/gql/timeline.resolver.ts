import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Args,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { DateTime } from 'luxon';
import { PrismaService } from 'src/common/prisma.service';
import { CustomLogger } from 'src/util/logger';

@ObjectType()
export class GqlTimelineDotModel {
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
export class GqlTimelineModel {
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

  @Field(() => [GqlTimelineDotModel], { nullable: true })
  dots: GqlTimelineDotModel[];
}

@InputType()
export class GqlTimelineDotModelCreateInput {
  @Field(() => String)
  title: string;

  @Field()
  description: string;

  @Field({ description: 'format yyyy-MM-dd' })
  date: string;
}

@InputType()
export class GqlTimelineDotModelUpdateInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field({ description: 'format yyyy-MM-dd', nullable: true })
  date?: string;
}

// @InputType()
// export class GqlTimelineDotModelBulkUpdateInput {
//   @Field(() => [GqlTimelineDotModel])
//   dots: GqlTimelineDotModelUpdateInput[];
// }

@InputType()
export class GqlTimelineModelCreateInput {
  @Field(() => String)
  title: string;

  @Field({ nullable: true })
  status?: string;

  @Field(() => [GqlTimelineDotModelCreateInput], { nullable: true })
  dots: GqlTimelineDotModelCreateInput[];
}

@InputType()
export class GqlTimelineModelUpdateInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field({ nullable: true })
  status?: string;
}

@Injectable()
@Resolver(() => GqlTimelineModel)
export class TimelineResolver {
  private readonly logger = new CustomLogger(TimelineResolver.name);
  constructor(private prisma: PrismaService) {}

  @Mutation(() => GqlTimelineModel)
  async createTimeline(@Args('input') args: GqlTimelineModelCreateInput) {
    return await this.prisma.timeline.create({
      data: {
        ...args,
        status: args.status || 'private',
        // https://zenn.dev/kanasugi/articles/4dbca26e1c4753
        dots: {
          createMany: {
            data: args.dots?.map((dot) => ({
              ...dot,
              date: DateTime.fromFormat(dot.date, 'yyyy-MM-dd').toJSDate(),
            })),
          },
        },
      },
    });
  }

  @Mutation(() => GqlTimelineModel)
  async updateTimeline(
    @Args('id') id: string,
    @Args('input') args: GqlTimelineModelUpdateInput,
  ) {
    return await this.prisma.timeline.update({
      where: { id },
      data: {
        ...args,
        status: args.status || 'private',
      },
    });
  }

  @Mutation(() => GqlTimelineModel)
  async deleteTimeline(@Args('id') id: string) {
    return this.prisma.timeline.delete({
      where: {
        id,
      },
    });
  }

  @Mutation(() => GqlTimelineDotModel)
  async updateTimelineDots(
    @Args('id') id: string,
    @Args('input') args: GqlTimelineDotModelUpdateInput,
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

  @Query(() => GqlTimelineModel)
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

    return timeline;
  }

  @Query(() => [GqlTimelineModel])
  async timelines() {
    const timelines = await this.prisma.timeline.findMany({
      include: {
        dots: true,
      },
    });

    return timelines;
  }
}
