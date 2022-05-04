import { Injectable, NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { PrismaService } from 'src/common/prisma.service';
import { TimelineCreateInput } from './timeline.resolver';

@Injectable()
export class TimelineService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(timelineId: string) {
    const timeline = await this.prisma.timeline.findUnique({
      where: { id: timelineId },
      include: {
        dots: true,
      },
    });

    if (!timeline) {
      throw new NotFoundException('timeline not found');
    }

    return timeline;
  }

  async create(input: TimelineCreateInput) {
    const created = await this.prisma.timeline.create({
      data: {
        ...input,
        status: input.status || 'private',
        // https://zenn.dev/kanasugi/articles/4dbca26e1c4753
        dots: {
          createMany: {
            data: input.dots?.map((dot) => ({
              ...dot,
              date: DateTime.fromFormat(dot.date, 'yyyy-MM-dd').toJSDate(),
            })),
          },
        },
      },
    });

    return this.getById(created.id);
  }
}
