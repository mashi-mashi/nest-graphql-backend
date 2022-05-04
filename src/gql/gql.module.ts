import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import * as path from 'path';
import { PrismaService } from 'src/common/prisma.service';
import { TimelineResolver } from './timeline.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      driver: ApolloDriver,
      context: (context) => context,
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),
  ],
  providers: [TimelineResolver, PrismaService],
})
export class GraphModule {}
