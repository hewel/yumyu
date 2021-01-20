import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Resource {
  @Field()
  title: string;

  @Field({ nullable: true })
  IMDBLink?: string;

  @Field({ nullable: true })
  source?: string;
}
