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

@InputType()
export class TimelineGQLModelInput {
  @Field(() => String)
  title: string;
  @Field({ nullable: true })
  status: string;
}

@Injectable()
@Resolver(() => TimelineGQLModel)
export class TimelineResolver {
  private readonly logger = new CustomLogger(TimelineResolver.name);
  constructor(private prisma: PrismaService) {}

  @Mutation(() => TimelineDotGQLModel)
  async createTimeline(@Args('input') args: TimelineGQLModelInput) {
    return this.prisma.timeline.create({
      data: {
        ...args,
        status: args.status || 'private',
      },
    });
  }

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

    return timeline;
  }

  @Query(() => [TimelineGQLModel])
  async timelines() {
    const timelines = await this.prisma.timeline.findMany({
      include: {
        dots: true,
      },
    });

    return timelines;
  }
}
