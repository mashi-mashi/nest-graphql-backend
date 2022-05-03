import { Query, Resolver } from '@nestjs/graphql';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AritcleModel {
  @Field((type) => String)
  id: string;

  @Field((type) => String)
  title: string;
}

@Resolver((of) => AritcleModel)
export class ArticleResolver {
  @Query(() => [AritcleModel], { name: 'articles', nullable: true })
  async getArticle() {
    return [
      {
        id: '1',
        title: 'NestJS is so good.',
      },
      {
        id: '2',
        title: 'GraphQL is so good.',
      },
    ];
  }
}
