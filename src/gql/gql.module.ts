import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import * as path from 'path';
import { PrismaService } from 'src/common/prisma.service';
import { TimelineResolver } from './timeline.resolver';
import { TimelineService } from './timeline.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      driver: ApolloDriver,
      context: ({ req }) => ({
        req,
      }),
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),
  ],
  providers: [TimelineResolver, PrismaService, TimelineService],
})
export class GraphModule {}
