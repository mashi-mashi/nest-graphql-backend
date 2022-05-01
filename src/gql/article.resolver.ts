import { Query, Resolver } from '@nestjs/graphql';
import { AritcleModel } from '../components/article.model';

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
