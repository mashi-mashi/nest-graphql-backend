import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AritcleModel {
  @Field((type) => String)
  id: string;

  @Field((type) => String)
  title: string;
}
