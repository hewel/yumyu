import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ResourceService } from './resource.service';
import { Resource } from './entities/resource.entity';

@Resolver(() => Resource)
export class ResourceResolver {
  constructor(private readonly resourceService: ResourceService) {}

  @Query(() => [Resource], { name: 'resource' })
  findAll() {
    return this.resourceService.findAll();
  }

  @Query(() => Resource, { name: 'resource' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.resourceService.findOne(id);
  }
}
